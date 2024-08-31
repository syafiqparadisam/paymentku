import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from './utils';

describe('Repository', () => {
  let provider: Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Repository],
    }).compile();

    provider = module.get<Repository>(Repository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
