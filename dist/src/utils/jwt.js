import crypto from 'node:crypto';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
function base64url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
function base64urlJson(obj) {
    return base64url(JSON.stringify(obj));
}
function hmacSha256(data, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
function parseExpires(expiresIn) {
    if (!expiresIn)
        return 0; // session token (no exp)
    if (typeof expiresIn === 'number')
        return expiresIn;
    const m = String(expiresIn).trim().match(/^(\d+)([smhd])$/i);
    if (!m) {
        // default 1h if format unknown
        return 3600;
    }
    const n = Number(m[1]);
    const unit = m[2].toLowerCase();
    switch (unit) {
        case 's':
            return n;
        case 'm':
            return n * 60;
        case 'h':
            return n * 3600;
        case 'd':
            return n * 86400;
        default:
            return 3600;
    }
}
export function signJwt(payload, { expiresIn } = {}) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const expSeconds = parseExpires(expiresIn ?? JWT_EXPIRES_IN);
    const body = { iat: now, ...(expSeconds ? { exp: now + expSeconds } : {}), ...payload };
    const headerB64 = base64urlJson(header);
    const payloadB64 = base64urlJson(body);
    const toSign = `${headerB64}.${payloadB64}`;
    const signature = hmacSha256(toSign, JWT_SECRET);
    return `${toSign}.${signature}`;
}
export function verifyJwt(token) {
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        throw new Error('Invalid token format');
    }
    const [headerB64, payloadB64, signature] = token.split('.');
    const expectedSig = hmacSha256(`${headerB64}.${payloadB64}`, JWT_SECRET);
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
        throw new Error('Invalid signature');
    }
    const payloadJson = Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
        throw new Error('Token expired');
    }
    return payload;
}
