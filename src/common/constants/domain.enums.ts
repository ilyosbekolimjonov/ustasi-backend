export const UserRole = {
  USER: 'USER',
  MASTER: 'MASTER',
  USER_FIZ: 'USER_FIZ',
  USER_YUR: 'USER_YUR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  VIEWER_ADMIN: 'VIEWER_ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const PaymentType = {
  PAYME: 'PAYME',
  CASH: 'CASH',
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const OrderStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ServiceRequestStatus = {
  OPEN: 'OPEN',
  CLAIMED: 'CLAIMED',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const;

export type ServiceRequestStatus =
  (typeof ServiceRequestStatus)[keyof typeof ServiceRequestStatus];

export const TimeUnit = {
  HOUR: 'HOUR',
  DAY: 'DAY',
} as const;

export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit];
