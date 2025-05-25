import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuardGuard } from '../access-token-guard/access-token-guard.guard';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

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
  ): Promise<AxiosResponse<any, any>> {
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

    return response;
  }

  @Get('history/topup')
  @UseGuards(AccessTokenGuardGuard)
  async getHistoryTopup(@Req() req: Request, @Res() res) {
    try {
      const path = `/history/topup`;
      const result = await this.forwardRequest('GET', path, req);
      console.log(result.data);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('history/topup/:id')
  @UseGuards(AccessTokenGuardGuard)
  async getHistoryTopupById(
    @Req() req: Request,
    @Res() res,
    @Param('id') id: string,
  ) {
    try {
      console.log('melbu kene kan');
      const path = `/history/topup/${id}`;
      const result = await this.forwardRequest('GET', path, req);
      console.log(result.data);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('history/transfer')
  @UseGuards(AccessTokenGuardGuard)
  async getHistoryTransfer(@Req() req: Request, @Res() res) {
    try {
      const path = `/history/transfer`;
      const result = await this.forwardRequest('GET', path, req);
      console.log(result.data);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('history/transfer/:id?')
  @UseGuards(AccessTokenGuardGuard)
  async getHistoryTransferById(
    @Req() req: Request,
    @Res() res,
    @Param('id') id: string,
  ) {
    try {
      const path = `/history/transfer/${id}`;
      const result = await this.forwardRequest('GET', path, req);
      console.log(result.data);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('transaction/topup')
  @UseGuards(AccessTokenGuardGuard)
  async topup(@Req() req: Request, @Body() body: any, @Res() res) {
    try {
      const result = await this.forwardRequest(
        'POST',
        '/transaction/topup',
        req,
        body,
      );
      console.log(result.data);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('transaction/transfer')
  @UseGuards(AccessTokenGuardGuard)
  async transfer(@Req() req: Request, @Body() body: any, @Res() res) {
    try {
      const result = await this.forwardRequest(
        'POST',
        '/transaction/transfer',
        req,
        body,
      );
      console.log(result.data);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
