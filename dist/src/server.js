import { sequelize } from './db/sequelize.js';
import './models/User.js'; // ensure model is registered
import { createApp } from './app.js';
import { PORT } from './config/env.js';
async function start() {
    try {
        await sequelize.sync();
        const app = createApp();
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to start server:', e);
        process.exit(1);
    }
}
start();
