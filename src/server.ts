import { sequelize } from './db/sequelize.js';
import './models/User.js';
import { createApp } from './app.js';
import { PORT } from './config/env.js';

async function start() {
  try {
    await sequelize.sync();

    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
}

start();
