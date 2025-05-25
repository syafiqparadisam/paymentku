import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class updateName {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class updatePhoneNumber {
  @IsNotEmpty()
  @IsString()
  @Matches(/^0\d{9,14}$/, {
    message: 'Nomor telepon tidak valid',
  })
  phone_number: string;
}

export class updateBio {
  @IsNotEmpty()
  @IsString()
  bio: string;
}
