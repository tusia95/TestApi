import { User } from '../models/User.js';
import type { PublicUser } from '../types/domain.js';

export async function findUserByEmail(email: string) {
  return User.findOne({ where: { email } });
}

export async function findUserById(id: string) {
  return User.findByPk(id);
}

export interface CreateUserInput {
  fullName: string;
  birthDate: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

export async function createUser(input: CreateUserInput) {
  return User.create(input);
}

export async function listUsers({ offset = 0, limit = 50 }: { offset?: number; limit?: number } = {}) {
  return User.findAndCountAll({ offset, limit, order: [['createdAt', 'DESC']] });
}

export async function deactivateUser(id: string) {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.isActive = false;
  await user.save();
  return user;
}

export function toPublicUser(userInstance: User): PublicUser {
  const { passwordHash, salt, ...rest } = userInstance.get({ plain: true }) as any;
  return rest as PublicUser;
}
