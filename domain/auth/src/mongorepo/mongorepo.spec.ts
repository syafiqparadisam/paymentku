import { Test, TestingModule } from '@nestjs/testing';
import { Mongorepo } from './mongorepo';

describe('Mongorepo', () => {
  let provider: Mongorepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mongorepo],
    }).compile();

    provider = module.get<Mongorepo>(Mongorepo);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
