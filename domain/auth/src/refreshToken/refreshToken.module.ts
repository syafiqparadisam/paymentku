import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refreshToken.service';
import { RefreshTokenProviders } from './refreshToken.provider';
import { MongorepoModule } from 'src/mongorepo/mongorepo.module';

@Module({
  imports: [MongorepoModule],
  providers: [RefreshTokenService, ...RefreshTokenProviders],
  exports: [RefreshTokenService]
})
export class RefreshTokenModule { }
