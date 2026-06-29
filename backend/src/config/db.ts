import dns from 'dns';
import mongoose from 'mongoose';
import { config } from './index';

function configureDnsForMongoSrv(): void {
  if (!config.mongoUri.startsWith('mongodb+srv://')) {
    return;
  }

  // Some ISPs block Node SRV lookups; public DNS servers resolve Atlas hosts reliably.
  const existingServers = dns.getServers();
  const fallbackServers = ['8.8.8.8', '1.1.1.1'];
  dns.setServers([...new Set([...fallbackServers, ...existingServers])]);
}

export async function connectDB() {
  try {
    configureDnsForMongoSrv();
    await mongoose.connect(config.mongoUri);
    console.log(' MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}
