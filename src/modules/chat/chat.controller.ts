import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/constants/domain.enums';
import { USER_ROLES } from '../../common/constants/user-roles';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get()
  @Roles(...USER_ROLES, UserRole.MASTER)
  @ApiOperation({ summary: 'List conversations for the current user or master' })
  list(@CurrentUser('sub') userId: string, @CurrentUser('role') role: string) {
    return this.chatService.listForActor(userId, role);
  }

  @Get(':conversationId')
  @Roles(...USER_ROLES, UserRole.MASTER)
  @ApiOperation({ summary: 'Get a conversation detail with messages' })
  findOne(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.findOneForActor(userId, role, conversationId);
  }

  @Post(':conversationId/messages')
  @Roles(...USER_ROLES, UserRole.MASTER)
  @ApiOperation({ summary: 'Send a message to a conversation' })
  sendMessage(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatService
      .sendMessage(userId, role, conversationId, dto)
      .then((message) => {
        this.chatGateway.emitNewMessage(conversationId, message);
        return message;
      });
  }
}
