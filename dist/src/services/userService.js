import { User } from '../models/User.js';
export async function findUserByEmail(email) {
    return User.findOne({ where: { email } });
}
export async function findUserById(id) {
    return User.findByPk(id);
}
export async function createUser(input) {
    return User.create(input);
}
export async function listUsers({ offset = 0, limit = 50 } = {}) {
    return User.findAndCountAll({ offset, limit, order: [['createdAt', 'DESC']] });
}
export async function deactivateUser(id) {
    const user = await User.findByPk(id);
    if (!user)
        return null;
    user.isActive = false;
    await user.save();
    return user;
}
export function toPublicUser(userInstance) {
    const { passwordHash, salt, ...rest } = userInstance.get({ plain: true });
    return rest;
}
