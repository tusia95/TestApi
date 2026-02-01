export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
export function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}
export function validateBirthDate(birthDate) {
    const d = new Date(birthDate);
    if (Number.isNaN(d.getTime()))
        return { ok: false, msg: 'birthDate must be a valid date (ISO 8601)' };
    const now = new Date();
    if (d > now)
        return { ok: false, msg: 'birthDate cannot be in the future' };
    const ageMs = now.getTime() - d.getTime();
    const years = ageMs / (365.25 * 24 * 60 * 60 * 1000);
    if (years > 130)
        return { ok: false, msg: 'birthDate is too far in the past' };
    return { ok: true, date: d.toISOString().slice(0, 10) };
}
