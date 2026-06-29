import dotenv = require('dotenv');
import { App } from './app';
import { connectDB } from './config/db';
import { config } from './config';
import { seedUpcomingShowtimesIfNeeded } from './bootstrap/seedUpcomingShowtimes';

dotenv.config();

async function start() {
  await connectDB();
  await seedUpcomingShowtimesIfNeeded();
  const appInstance=new App()
  const app = appInstance.getApp();
  app.listen(config.serverPort, () =>
    console.log(` Server running on port http://localhost:${config.serverPort}`)
  );
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
