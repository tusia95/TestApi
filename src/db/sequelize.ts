import { Sequelize } from 'sequelize';
import { DATABASE_URL, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } from '../config/env.js';

// Инициализация Sequelize для PostgreSQL. Для коннекта предпочитаем DATABASE_URL
let sequelizeConfig: any;
if (DATABASE_URL) {
  sequelizeConfig = {
    url: DATABASE_URL,
    options: {
      dialect: 'postgres' as const,
      logging: false,
    },
  };
} else {
  sequelizeConfig = {
    options: {
      dialect: 'postgres' as const,
      host: PGHOST,
      port: PGPORT,
      username: PGUSER,
      password: PGPASSWORD,
      database: PGDATABASE,
      logging: false,
    },
  };
}

export const sequelize = DATABASE_URL
  ? new Sequelize(sequelizeConfig.url, sequelizeConfig.options)
  : new Sequelize(
      sequelizeConfig.options.database,
      sequelizeConfig.options.username,
      sequelizeConfig.options.password,
      {
        ...sequelizeConfig.options,
      }
    );
