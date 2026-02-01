export const PORT: number = Number(process.env.PORT) || 3000;
export const NODE_ENV: string = process.env.NODE_ENV || 'development';

// конфигурация для генерации токена
export const JWT_SECRET: string = process.env.JWT_SECRET || 'dev-secret-change-me';
export type ExpiresIn = string | number | undefined;
export const JWT_EXPIRES_IN: ExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

// конфигурация БД
export const DATABASE_URL: string = process.env.DATABASE_URL || '';
export const PGHOST: string = process.env.PGHOST || 'localhost';
export const PGPORT: number = Number(process.env.PGPORT) || 5432;
export const PGUSER: string = process.env.PGUSER || 'postgres';
export const PGPASSWORD: string = process.env.PGPASSWORD || '';
export const PGDATABASE: string = process.env.PGDATABASE || 'effectivemobile';
