import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuardGuard } from '../access-token-guard/access-token-guard.guard';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Controller('/api/v1')
export class TransactionalController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async forwardRequest(
    method: 'GET' | 'POST',
    path: string,
    req,
    data?: any,
  ) {
    const headers = {
      'X-Request-Id': crypto.randomUUID(),
      'X-Internal-Secret': this.configService.get<string>('INTERNAL_SECRET'),
      'X-Userid': req.user_id, // atau req.user_id, tergantung guard Anda
    };

    const url = this.configService.get<string>('TRANSACTIONAL_SVC') + path;

    console.log(url);
    const options = {
      headers,
    };

    const response = await firstValueFrom(
      method === 'GET'
        ? this.httpService.get(url, options)
        : this.httpService.post(url, data, options),
    );

    return response.data;
  }

  @Get('history/topup/:id?')
  @UseGuards(AccessTokenGuardGuard)
  async getHistoryTopup(@Req() req: Request, @Param('id') id?: string) {
    const path = id ? `/history/topup/${id}` : `/history/topup`;
    return await this.forwardRequest('GET', path, req);
  }

  @Get('history/transfer/:id?')
  @UseGuards(AccessTokenGuardGuard)
  async getHistoryTransfer(@Req() req: Request, @Param('id') id?: string) {
    const path = id ? `/history/transfer/${id}` : `/history/transfer`;
    return await this.forwardRequest('GET', path, req);
  }

  @Post('transaction/topup')
  @UseGuards(AccessTokenGuardGuard)
  async topup(@Req() req: Request, @Body() body: any) {
    return await this.forwardRequest('POST', '/transaction/topup', req, body);
  }

  @Post('transaction/transfer')
  @UseGuards(AccessTokenGuardGuard)
  async transfer(@Req() req: Request, @Body() body: any) {
    return await this.forwardRequest(
      'POST',
      '/transaction/transfer',
      req,
      body,
    );
  }
}
