import Redis from 'ioredis';
import jwt from 'jsonwebtoken';

export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async blacklistRefreshToken(refreshToken: string): Promise<void> {
    try {
      const decoded = jwt.decode(refreshToken) as any;
      if (decoded && decoded.exp && decoded.jti) {
        const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiryTime > 0) {
          await this.redis.setex(`blacklist:${decoded.jti}`, expiryTime, 'revoked');
        }
      }
    } catch (error) {
      console.error('Error blacklisting token:', error);
    }
  }

  async isRefreshTokenBlacklisted(refreshToken: string): Promise<boolean> {
    try {
      const decoded = jwt.decode(refreshToken) as any;
      if (decoded && decoded.jti) {
        const result = await this.redis.get(`blacklist:${decoded.jti}`);
        return result === 'revoked';
      }
      return false;
    } catch (error) {
      console.error('Error checking blacklist:', error);
      return false;
    }
  }

  async revokeAllUserTokens(userId: string, userType: string): Promise<void> {
    try {
      await this.redis.del(`user:${userId}:${userType}:refresh`);
    } catch (error) {
      console.error('Error revoking user tokens:', error);
    }
  }
}
