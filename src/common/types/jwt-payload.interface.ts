import { UserRole } from '../constants/domain.enums';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  sid: string;
  type: 'access' | 'refresh';
}
