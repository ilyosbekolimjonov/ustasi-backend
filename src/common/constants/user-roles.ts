import { UserRole } from './domain.enums';

export const USER_ROLES = [
  UserRole.USER,
  UserRole.USER_FIZ,
  UserRole.USER_YUR,
] as const;

export function isUserRole(role?: string | null): role is (typeof USER_ROLES)[number] {
  return !!role && USER_ROLES.includes(role as (typeof USER_ROLES)[number]);
}
