import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedisService {
  private redisLock: Redlock;
  private durationQuery: number;
  constructor(
    @Inject('RedisClient')
    private redisStore: Redis,
  ) {
    // config for redis instance
    this.redisLock = new Redlock([redisStore], {
      driftFactor: 0.01,
      retryCount: -1,
      retryDelay: 200,
      retryJitter: 200,
    });
    this.durationQuery = 2000;
  }

  async addAuthTokenWithExpire(key: string, lockKey: string[], value: number) {
    try {
      const twomonth = 3600 * 24 * 7 * 8;
      const locking = await this.redisLock.acquire(lockKey, this.durationQuery);
      await this.redisStore.setex('auth:' + key, twomonth, value.toString());
      await locking.release();
    } catch (error) {
      throw error;
    }
  }

  async getUserIdByAuthToken(key: string, lockKey: string[]): Promise<string> {
    try {
      const locking = await this.redisLock.acquire(lockKey, this.durationQuery);
      const userid = await this.redisStore.get('auth:' + key);
      await locking.release();
      return userid;
    } catch (error) {
      throw error;
    }
  }

  async isAuthTokenAlreadyExist(
    key: string,
    lockKey: string[],
  ): Promise<boolean> {
    try {
      const locking = await this.redisLock.acquire(lockKey, this.durationQuery);
      const isExist = await this.redisStore.exists('auth:' + key);

      // 1 mean exist
      if (isExist === 1) {
        return true;
      }
      // 0 mean not exist
      await locking.release();
      return false;
    } catch (error) {
      throw error;
    }
  }

  async decreaseExpireAuthToken(
    key: string,
    lockKey: string[],
  ): Promise<number> {
    try {
      const locking = await this.redisLock.acquire(lockKey, this.durationQuery);
      const remainingTimeToken = await this.redisStore.ttl('auth:' + key);
      console.log(remainingTimeToken);
      // turunkan ttl - 10 menit
      const decrease30minutes = 10 * 60;
      const exp = await this.redisStore.expire(
        'auth:' + key,
        remainingTimeToken - decrease30minutes,
      );
      await locking.release();
      return exp;
    } catch (error) {
      throw error;
    }
  }

  async getPWToken(token: string, lockKey: string[]): Promise<string> {
    try {
      const locking = await this.redisLock.acquire(lockKey, this.durationQuery);
      const pwToken = await this.redisStore.get('pwtoken:' + token);
      await locking.release();
      return pwToken;
    } catch (error) {
      throw error;
    }
  }

  async insertPWToken(
    key: string,
    val: string,
    lockKey: string[],
  ): Promise<void> {
    try {
      const locking = await this.redisLock.acquire(lockKey, this.durationQuery);
      const fiveMinutes = 60 * 5;
      await this.redisStore.setex('pwtoken:' + key, fiveMinutes, val);
      await locking.release();
    } catch (error) {
      throw error;
    }
  }

  async deletePWToken(token: string, lockKey: string[]): Promise<void> {
    try {
      const locking = await this.redisLock.acquire(lockKey, this.durationQuery);
      await this.redisStore.del('pwtoken:' + token);
      await locking.release();
    } catch (error) {
      throw error;
    }
  }

  async deleteToken(key: string, lockKey: string[]): Promise<void> {
    try {
      const locking = await this.redisLock.acquire(lockKey, this.durationQuery);
      await this.redisStore.del('auth:' + key);
      await locking.release();
    } catch (error) {
      throw error;
    }
  }
}
