import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './schemas/users.entity';
import { ObjectId, Repository } from 'typeorm';
import { loginWithGoogle, registerRequest } from '../auth/dtos/request';
import * as bcrypt from 'bcrypt';
import generateRandNum from './utils/randNum';
import { Profile } from './schemas/profile.entity';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';
import { result } from 'src/interfaces/result';
import { v4 } from "uuid"
import { HistoryTopup } from './schemas/history_topup.entity';
import { HistoryTransfer } from './schemas/history_transfer.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    @InjectRepository(HistoryTopup)
    private historyTopUpRepo: Repository<HistoryTopup>,
    @InjectRepository(HistoryTransfer)
    private historyTransferRepo: Repository<HistoryTransfer>,
    private mongorToken: RefreshTokenService,
  ) { }

  generateAccountNumber(): number {
    return Math.floor(Math.random() * 9999999999) + 1;
  }

  async findAccNumber(accNumber: number): Promise<Users[]> {
    return this.userRepo.find({ where: { accountNumber: accNumber } })
  }
  async createAccountNumber(): Promise<number> {
    let accNumber: number;
    // check accountNumber is duplicate
    while (true) {
      const randNum: number = generateRandNum()
      const user: Users[] = await this.findAccNumber(randNum);
      if (user.length === 0) {
        accNumber = randNum;
        break;
      }
    }
    return accNumber
  }



  async createAccount(data: registerRequest): Promise<result> {

    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(data.password, salt);
      const accNumber = await this.createAccountNumber()

      const profile = new Profile()
      profile.name = data.user + generateRandNum().toString()
      await this.profileRepo.save(profile)

      // init _id in mongodb
      const userInMongo = await this.mongorToken.initAndFind()
      // insert first
      await this.userRepo.insert({
        user: data.user,
        email: data.email,
        password,
        refreshToken_id: userInMongo.data._id.toString(),
        accountNumber: accNumber,
        profile
      });
      return { success: true }
    } catch (error) {
      return { success: false, data: error }
    }

  }

  findEmailByEmail(email: string): Promise<Users> {
    return this.userRepo.findOne({ where: { email } })
  }

  // insertHistoryTopUpId(id: number): Promise<void> {
  //   return this.repository.in
  // }

  findUserById(id: number): Promise<Users> {
    return this.userRepo.findOne({ where: { id } })
  }

  findUserByEmail(email: string): Promise<Users> {
    return this.userRepo.findOne({ where: { email } });
  }

  findUserByUsername(user: string) {
    return this.userRepo.findOne({ where: { user } })
  }
  findUserByRefreshTokenId(token_id: string): Promise<Users> {
    return this.userRepo.findOne({ where: { refreshToken_id: token_id } })
  }

  async updateName(profileId: number, name: any): Promise<result> {
    console.log(name)
    try {
      await this.profileRepo.update({ id: profileId }, { name: name.givenName + " " + name.familyName })
      return { success: true }
    } catch (error) {
      return { success: false, data: error }
    }
  }

  async joiningUserAndProfile(userId: number): Promise<result> {
    try {
      console.log(userId)
      const JoininguserAndProfile = await this.userRepo.createQueryBuilder('users').leftJoinAndSelect("users.profile", "profile").getOne()
      console.log(JoininguserAndProfile)
      return { success: true, data: JoininguserAndProfile }
    } catch (error) {
      return { success: false, data: error }
    }
  }

  async updatePhotoProfile(profileId: number, photo_profile: string): Promise<result> {
    console.log(photo_profile)
    try {
      await this.profileRepo.update({ id: profileId }, { photo_profile })
      return { success: true }
    } catch (error) {
      return { success: false, data: error }
    }
  }

  async createAccountWithGoogle(user: loginWithGoogle): Promise<result> {
    try {
      const accNumber = await this.createAccountNumber()
      const profile = new Profile()
      profile.name = user.name.givenName + " " + user.name.familyName
      profile.photo_profile = user.picture
      await this.profileRepo.save(profile)
      const userInMongo = await this.mongorToken.initAndFind()
      await this.userRepo.insert({
        user: user.username,
        email: user.email,
        refreshToken_id: userInMongo.data._id.toString(),
        accountNumber: accNumber,
        profile: profile
      })
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
