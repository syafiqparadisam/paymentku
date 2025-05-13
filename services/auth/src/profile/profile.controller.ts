import { Controller, Get, HttpStatus, Inject, LoggerService, Request, Response, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { response } from 'src/interfaces/response';
import { AccessTokenGuardGuard } from 'src/access-token-guard/access-token-guard.guard';
import { ProfileService } from './profile.service';

@Controller('/api/v1/profile')
export class ProfileController {
	constructor(
		private configService: ConfigService,
		private profileService: ProfileService
	) {}

	// Get user profile
	@Get("/")
	@UseGuards(AccessTokenGuardGuard)
	async getUserProfile(
		@Request() req,
		@Response() res
	) {		
		try {
			await this.profileService.getUserProfile(req.user_id)
			
		} catch (error) {
			console.log(error)
			return res.sendStatus(HttpStatus.OK)			
		}
	}
}
