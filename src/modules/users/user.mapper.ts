export type PublicUser = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  regionId: string;
  role: string;
  status: string;
  isVerified: boolean;
  iin: string | null;
  mfo: string | null;
  rs: string | null;
  bank: string | null;
  oked: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserLike = PublicUser & {
  passwordHash?: string;
  emailVerificationTokenHash?: string | null;
  emailVerificationTokenExpiresAt?: Date | null;
};

export function toPublicUser(user: UserLike): PublicUser {
  const {
    id,
    fullname,
    email,
    phone,
    regionId,
    role,
    status,
    isVerified,
    iin,
    mfo,
    rs,
    bank,
    oked,
    address,
    createdAt,
    updatedAt,
  } = user;

  return {
    id,
    fullname,
    email,
    phone,
    regionId,
    role,
    status,
    isVerified,
    iin,
    mfo,
    rs,
    bank,
    oked,
    address,
    createdAt,
    updatedAt,
  };
}

