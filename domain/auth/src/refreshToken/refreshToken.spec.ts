import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenModule } from './refreshToken.module';
import { RefreshTokenService } from './refreshToken.service';

describe('Mongo', () => {
  let provider: RefreshTokenModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshTokenService],
    }).compile();

    provider = module.get<RefreshTokenModule>(RefreshTokenModule);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
