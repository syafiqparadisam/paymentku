import { Users } from "../schemas/users.entity";
import { UsersService } from "../users.service";

function generateAccountNumber(): number {
  return Math.floor(Math.random() * 9999999999) + 1;
}

export async function createAccountNumber(): Promise<number> {
  let accNumber: number;
  let userService: UsersService
  // check accountNumber is duplicate
  while (true) {
    const randNum: number = generateAccountNumber();
    const user: Users[] = await userService.findByNumber(randNum);
    if (user.length === 0) {
      accNumber = randNum;
      break;
    }
  }
  return accNumber
}