import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthGuard, RefreshTokenGuard, RolesGuard],
  exports: [JwtModule, AuthGuard, RefreshTokenGuard, RolesGuard],
})
export class CommonModule {}
