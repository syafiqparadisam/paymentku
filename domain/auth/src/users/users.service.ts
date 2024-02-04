import { Dependencies, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './schemas/users.entity';
import { DataSource, Repository } from 'typeorm';
import { loginWithGoogle, registerRequest } from '../auth/dtos/request';
import * as bcrypt from 'bcrypt';
import { createAccountNumber } from './utils/CreateAccNumber';
import { Model } from 'mongoose';
import generateRandNum from './utils/randNum';
import { HistoryTopup } from './schemas/history_topup.entity';
import { HistoryTransfer } from './schemas/history_transfer.entity';
import { Profile } from './schemas/profile.entity';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
  ) { }

  async findByNumber(accNumber: number): Promise<Users[]> {
    return this.repository.findBy({ accountNumber: accNumber });
  }

  async createAccount(data: registerRequest): Promise<{ success: boolean, error?: any }> {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(data.password, salt);
      const accNumber = await createAccountNumber()

      const profile = new Profile()
      profile.name = data.user + generateRandNum().toString()

      await this.repository.insert({
        user: data.user,
        email: data.email,
        password,
        accountNumber: accNumber,
        profile
      });

      return { success: true }
    } catch (error) {
      return { success: false, error: error }
    }

  }
  findUserById(id: number): Promise<Users> {
    return this.repository.findOne({ where: { id } })
  }

  findUserByEmail(email: string): Promise<Users> {
    return this.repository.findOne({ where: { email } });
  }

  findUserByUsername(user: string) {
    return this.repository.findOne({ where: { user } })
  }

  async createAccountWithGoogle(user: loginWithGoogle): Promise<{ success: boolean }> {
    const accNumber = await createAccountNumber()
    const profile = new Profile()
    profile.name = user.name
    profile.photo_profile = user.picture
    try {
      await this.repository.insert({ user: user.username, email: user.email, accountNumber: accNumber, profile: profile})
      return { success: true }
    } catch (error) {
      console.log(error)
      return { success: false }
    }
  }

  comparePassword(
    passwordFromPayload: string,
    passFromFindData: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordFromPayload, passFromFindData);
  }


}
