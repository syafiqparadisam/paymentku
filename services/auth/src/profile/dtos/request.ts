import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class updateName {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class updatePhoneNumber {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: 'Nomor telepon tidak valid',
  })
  phone_number: string;
}

export class updateBio {
  @IsNotEmpty()
  @IsString()
  bio: string;
}
