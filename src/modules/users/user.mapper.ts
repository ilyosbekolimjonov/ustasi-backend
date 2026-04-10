type PublicMasterProfile = {
  id: string;
  slug: string;
  category: string;
  city: string;
  region: string | null;
  bio: string;
  experienceText: string;
  experienceYears: number | null;
  profileImageUrl: string;
  isAvailable: boolean;
  ratingAverage: number;
  jobsCompletedCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatarUrl: string | null;
  regionId: string | null;
  address: string | null;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  masterProfile?: PublicMasterProfile | null;
};

type UserLike = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatarUrl?: string | null;
  regionId?: string | null;
  address?: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  masterProfile?: {
    id: string;
    slug: string;
    category: string;
    city: string;
    region: string | null;
    bio: string;
    experienceText: string;
    experienceYears: number | null;
    profileImageUrl: string;
    isAvailable: boolean;
    ratingAverage: unknown;
    jobsCompletedCount: number;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export function toPublicUser(user: UserLike): PublicUser {
  return {
    id: user.id,
    fullName: user.fullname,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl ?? null,
    regionId: user.regionId ?? null,
    address: user.address ?? null,
    isEmailVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    masterProfile: user.masterProfile
      ? {
          ...user.masterProfile,
          ratingAverage: Number(user.masterProfile.ratingAverage ?? 0),
        }
      : undefined,
  };
}
