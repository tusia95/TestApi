export type Role = 'admin' | 'user';

export interface JwtPayload {
  sub: string;
  role: Role;
  email: string;
  iat?: number;
  exp?: number;
}

export type PublicUser = {
    id: string;
    fullName: string;
    birthDate: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};