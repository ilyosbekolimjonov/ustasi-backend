import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { AppConfig } from '../../config/app.config';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { ChatService } from './chat.service';
import { JoinConversationDto } from './dto/join-conversation.dto';

type AuthenticatedSocket = Socket & {
  data: {
    user?: JwtPayload;
  };
};

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    server.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = this.extractToken(socket);

        if (!token) {
          return next(new Error('Access token is required'));
        }

        const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
          secret: this.configService.getOrThrow<string>('auth.accessSecret'),
        });

        if (payload.type !== 'access') {
          return next(new Error('Invalid token type'));
        }

        socket.data.user = payload;
        return next();
      } catch {
        return next(new Error('Invalid or expired access token'));
      }
    });
  }

  @SubscribeMessage('conversation:join')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: JoinConversationDto,
  ) {
    const user = client.data.user;

    if (!user) {
      return { ok: false, message: 'Unauthorized' };
    }

    await this.chatService.assertConversationAccess(
      user.sub,
      user.role,
      dto.conversationId,
    );

    await client.join(this.getRoomName(dto.conversationId));

    return { ok: true, conversationId: dto.conversationId };
  }

  @SubscribeMessage('conversation:leave')
  async handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: JoinConversationDto,
  ) {
    await client.leave(this.getRoomName(dto.conversationId));
    return { ok: true, conversationId: dto.conversationId };
  }

  emitNewMessage(conversationId: string, message: unknown) {
    this.server.to(this.getRoomName(conversationId)).emit('message:new', {
      conversationId,
      message,
    });
  }

  private extractToken(client: AuthenticatedSocket) {
    const authToken = client.handshake.auth?.token;
    const headerToken = client.handshake.headers.authorization?.split(' ')[1];
    const rawToken =
      typeof authToken === 'string' && authToken.length > 0
        ? authToken
        : headerToken;

    return rawToken?.replace(/^Bearer\s+/i, '').trim();
  }

  private getRoomName(conversationId: string) {
    return `conversation:${conversationId}`;
  }
}
