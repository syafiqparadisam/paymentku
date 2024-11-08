import { AuthGuard } from '@nestjs/passport';

export class GoogleOauthGuard extends AuthGuard('google') {}
