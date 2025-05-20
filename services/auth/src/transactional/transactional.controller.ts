import { Controller, Get } from '@nestjs/common';

@Controller('/api/v1')
export class TransactionalController {
  @Get('history/topup')
  async getHistoryTopup() {

  }

  @Get('/history/transfer')
  async getHistoryTransfer() {

  }

  
}
