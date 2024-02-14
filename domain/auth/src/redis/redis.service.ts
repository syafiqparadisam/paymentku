import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';


@Injectable()
export class RedisService {
    constructor(
        @Inject()
        private readonly redisClient: Redis
    ) { }


    async setPWTokenWithExpiry(key: string, object: object): Promise<void> {
        const multi = this.redisClient.multi()
        multi.hmset(key, object)
        multi.expire(key, 150)
        multi.exec((err, result) => {
            if (err) {
                console.log(err)
                return err
            }
            console.log(result)
            return result
        })
    }

    async getPWTokenWithUserId(key: string, ...fields: any): Promise<string[]> {
        try {
            const result = await this.redisClient.hmget(key, fields)
            return result
        } catch (error) {
            return error
        }
    }
}