import crypto from 'node:crypto';
export function hashPassword(password, saltHex) {
    const salt = saltHex ? Buffer.from(saltHex, 'hex') : crypto.randomBytes(16);
    const hash = crypto.scryptSync(String(password), salt, 64);
    return { hash: hash.toString('hex'), salt: salt.toString('hex') };
}
export function verifyPassword(password, saltHex, expectedHashHex) {
    const { hash } = hashPassword(password, saltHex);
    // timingSafeEqual requires Buffers of same length
    const a = Buffer.from(hash, 'hex');
    const b = Buffer.from(String(expectedHashHex || ''), 'hex');
    if (a.length !== b.length)
        return false;
    return crypto.timingSafeEqual(a, b);
}
