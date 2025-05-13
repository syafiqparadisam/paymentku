import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
	constructor(
		private usersService: UsersService,
		private readonly configService: ConfigService,
		private redisService: RedisService
	){}

	async getUserProfile(userid: number) {
		try {
		const user = await this.usersService.getUserProfile(userid)
			
		} catch (error) {
			
		}

	}
}
