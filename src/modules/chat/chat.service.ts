import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRole } from '../../common/constants/domain.enums';
import { isUserRole } from '../../common/constants/user-roles';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

const conversationListInclude = {
  request: {
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      city: true,
      addressText: true,
      budgetMin: true,
      budgetMax: true,
      images: true,
      status: true,
      claimedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  user: {
    select: {
      id: true,
      fullname: true,
      phone: true,
      avatarUrl: true,
    },
  },
  master: {
    select: {
      id: true,
      fullname: true,
      phone: true,
      avatarUrl: true,
      masterProfile: {
        select: {
          id: true,
          slug: true,
          category: true,
          city: true,
          profileImageUrl: true,
        },
      },
    },
  },
  messages: {
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
    select: {
      id: true,
      senderId: true,
      text: true,
      createdAt: true,
      readAt: true,
      sender: {
        select: {
          id: true,
          fullname: true,
          avatarUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ConversationInclude;

const conversationDetailInclude = {
  ...conversationListInclude,
  messages: {
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
      senderId: true,
      text: true,
      createdAt: true,
      readAt: true,
      sender: {
        select: {
          id: true,
          fullname: true,
          avatarUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ConversationInclude;

type ConversationListRecord = Prisma.ConversationGetPayload<{
  include: typeof conversationListInclude;
}>;

type ConversationDetailRecord = Prisma.ConversationGetPayload<{
  include: typeof conversationDetailInclude;
}>;

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async listForActor(userId: string, role: string) {
    await this.ensureActorConversations(userId, role);

    const conversations = await this.prisma.conversation.findMany({
      where: this.buildConversationWhere(userId, role),
      include: conversationListInclude,
    });

    return conversations
      .map((conversation) => this.toConversationSummary(conversation, userId, role))
      .sort(
        (left, right) =>
          new Date(right.lastActivityAt).getTime() -
          new Date(left.lastActivityAt).getTime(),
      );
  }

  async findOneForActor(userId: string, role: string, conversationId: string) {
    await this.ensureActorConversations(userId, role);
    await this.markMessagesRead(userId, role, conversationId);

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        ...this.buildConversationWhere(userId, role),
      },
      include: conversationDetailInclude,
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.toConversationDetail(conversation, userId, role);
  }

  async sendMessage(
    userId: string,
    role: string,
    conversationId: string,
    dto: CreateMessageDto,
  ) {
    await this.ensureActorConversations(userId, role);

    const text = dto.text.trim();

    if (!text) {
      throw new BadRequestException('Message text is required');
    }

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        ...this.buildConversationWhere(userId, role),
      },
      include: conversationDetailInclude,
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        text,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullname: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.toMessage(message);
  }

  async assertConversationAccess(
    userId: string,
    role: string,
    conversationId: string,
  ) {
    await this.ensureActorConversations(userId, role);

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        ...this.buildConversationWhere(userId, role),
      },
      select: {
        id: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  private async ensureActorConversations(userId: string, role: string) {
    const requests = await this.prisma.serviceRequest.findMany({
      where:
        role === UserRole.MASTER
          ? {
              claimedByMasterId: userId,
              status: {
                in: ['CLAIMED', 'IN_PROGRESS', 'DONE'],
              },
              conversation: null,
            }
          : isUserRole(role)
            ? {
                userId,
                claimedByMasterId: {
                  not: null,
                },
                status: {
                  in: ['CLAIMED', 'IN_PROGRESS', 'DONE'],
                },
                conversation: null,
              }
            : {
                id: '__no_results__',
              },
      select: {
        id: true,
        userId: true,
        claimedByMasterId: true,
      },
    });

    if (!requests.length) {
      return;
    }

    await this.prisma.$transaction(
      requests.map((request) =>
        this.prisma.conversation.upsert({
          where: {
            requestId: request.id,
          },
          create: {
            requestId: request.id,
            userId: request.userId,
            masterId: request.claimedByMasterId!,
          },
          update: {},
        }),
      ),
    );
  }

  private async markMessagesRead(
    userId: string,
    role: string,
    conversationId: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        ...this.buildConversationWhere(userId, role),
      },
      select: {
        id: true,
      },
    });

    if (!conversation) {
      return;
    }

    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: userId,
        },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  private buildConversationWhere(userId: string, role: string) {
    if (role === UserRole.MASTER) {
      return {
        masterId: userId,
      };
    }

    if (isUserRole(role)) {
      return {
        userId,
      };
    }

    throw new NotFoundException('Conversation not found');
  }

  private toConversationSummary(
    conversation: ConversationListRecord,
    userId: string,
    role: string,
  ) {
    const lastMessage = conversation.messages[0] ?? null;

    return {
      id: conversation.id,
      requestId: conversation.requestId,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      lastActivityAt: lastMessage?.createdAt ?? conversation.createdAt,
      request: this.toRequestSummary(conversation.request),
      counterpart: this.toCounterpart(conversation, userId, role),
      lastMessage: lastMessage ? this.toMessage(lastMessage) : null,
    };
  }

  private toConversationDetail(
    conversation: ConversationDetailRecord,
    userId: string,
    role: string,
  ) {
    return {
      id: conversation.id,
      requestId: conversation.requestId,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      lastActivityAt:
        conversation.messages[conversation.messages.length - 1]?.createdAt ??
        conversation.createdAt,
      request: this.toRequestSummary(conversation.request),
      counterpart: this.toCounterpart(conversation, userId, role),
      messages: conversation.messages.map((message) => this.toMessage(message)),
    };
  }

  private toCounterpart(
    conversation: ConversationListRecord | ConversationDetailRecord,
    userId: string,
    role: string,
  ) {
    if (role === UserRole.MASTER) {
      return {
        id: conversation.user.id,
        fullName: conversation.user.fullname,
        phone: conversation.user.phone,
        avatarUrl: conversation.user.avatarUrl,
        role: UserRole.USER,
        masterProfile: null,
      };
    }

    return {
      id: conversation.master.id,
      fullName: conversation.master.fullname,
      phone: conversation.master.phone,
      avatarUrl: conversation.master.avatarUrl,
      role: UserRole.MASTER,
      masterProfile: conversation.master.masterProfile,
    };
  }

  private toRequestSummary(
    request: ConversationListRecord['request'] | ConversationDetailRecord['request'],
  ) {
    return {
      id: request.id,
      title: request.title,
      description: request.description,
      category: request.category,
      city: request.city,
      addressText: request.addressText,
      budgetMin: request.budgetMin !== null ? Number(request.budgetMin) : null,
      budgetMax: request.budgetMax !== null ? Number(request.budgetMax) : null,
      images: request.images,
      status: request.status,
      claimedAt: request.claimedAt,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };
  }

  private toMessage(
    message:
      | ConversationListRecord['messages'][number]
      | ConversationDetailRecord['messages'][number]
      | Prisma.MessageGetPayload<{
          include: {
            sender: {
              select: {
                id: true;
                fullname: true;
                avatarUrl: true;
              };
            };
          };
        }>,
  ) {
    return {
      id: message.id,
      senderId: message.senderId,
      text: message.text,
      createdAt: message.createdAt,
      readAt: message.readAt,
      sender: {
        id: message.sender.id,
        fullName: message.sender.fullname,
        avatarUrl: message.sender.avatarUrl,
      },
    };
  }
}
