import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class registerRequest {
  @IsNotEmpty()
  @MaxLength(100)
  user: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class loginRequest {
  @IsNotEmpty()
  @MaxLength(100)
  user: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}

export class updateUsernameDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  username: string;

  @MaxLength(30)
  password: string;
}

export class verifyPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  username: string;
  password: string;
}

export class loginWithGoogle {
  @IsNotEmpty()
  provider: string;

  @IsNumber()
  providerID: number;

  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: { givenName: string; familyName: string };

  @IsNotEmpty()
  picture: string;
}

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class NewPWDTO {
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  confirmPassword: string;
}

export class VerifyDeleteAccount {
  @MaxLength(30)
  password: string;
}
