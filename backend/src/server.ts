import dotenv = require('dotenv');
import { App } from './app';
import { connectDB } from './config/db';
import { config } from './config';

dotenv.config();

async function start() {
  await connectDB();
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
