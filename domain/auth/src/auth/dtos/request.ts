import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, MaxLength, Min, MinLength, isNumber } from "class-validator"

export class registerRequest {
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(2)
  user: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(2)
  email: string;
}

export class loginRequest {
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(2)
  user: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}

export class loginWithGoogle {
  @IsNotEmpty()
  provider: string;

  @IsNumber()
  providerID: number;

  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(2)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(2)
  email: string;

  @IsNotEmpty()
  name: { givenName: string, familyName: string };

  @IsNotEmpty()
  picture: string;
}

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(2)
  email: string;
}