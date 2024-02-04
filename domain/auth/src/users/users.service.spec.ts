import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { registerRequest } from 'src/auth/dtos/request';
import { Repository } from 'typeorm';
import { Users } from './schemas/users.entity';
import { JwtModule } from '@nestjs/jwt';
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });


  it('should be defined', async () => {
   
  });
});
