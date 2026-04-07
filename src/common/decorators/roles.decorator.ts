import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../constants/domain.enums';

export const ROLE_TYPES = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLE_TYPES, roles);
