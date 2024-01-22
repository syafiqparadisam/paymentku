import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { registerRequest } from '../interfaces/request';
import * as bcrypt from 'bcrypt';
import generateAccountNumber from './utils/generateAccNumber';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
  ) {}

  async findByNumber(accNumber: number): Promise<Users[]> {
    return this.repository.findBy({ accountNumber: accNumber });
  }

  async createAccount(data: registerRequest): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);
    let accNumber: number;

    // check accountNumber is duplicate
    while (true) {
      const randNum: number = generateAccountNumber();
      const user: Users[] = await this.findByNumber(randNum);
      if (user.length === 0) {
        accNumber = randNum;
        break;
      }
    }

    await this.repository.insert({
      user: data.user,
      password: password,
      email: data.email,
      accountNumber: accNumber,
    });
  }

  findUser(user: string): Promise<Users> {
    return this.repository.findOne({ where: { user } });
  }
  findRefreshToken(token: string): Promise<Users> {
    console.log(token);
    return this.repository.findOne({ where: { refreshToken: token } });
  }

  comparePassword(
    passwordFromPayload: string,
    passFromFindData: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordFromPayload, passFromFindData);
  }

  async addRefreshToken(token: string, user: string): Promise<void> {
    await this.repository.update({ user: user }, { refreshToken: token });
  }

  async deleteRefreshToken(user: string): Promise<void> {
    await this.repository.update({ user }, { refreshToken: null });
  }
}
