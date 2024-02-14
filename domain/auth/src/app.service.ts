import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return { message: 'server ini diakses dari nginx port 80' };
  }
}
