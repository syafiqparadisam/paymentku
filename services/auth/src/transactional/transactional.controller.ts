import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
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
    method: 'GET' | 'POST' | 'DELETE',
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

    const options = {
      headers,
    };

    let response;
    switch (method) {
      case 'GET':
        response = await firstValueFrom(this.httpService.get(url, options));
        break;
      case 'POST':
        response = await firstValueFrom(
          this.httpService.post(url, data, options),
        );
        break;
      case 'DELETE':
        response = await firstValueFrom(this.httpService.delete(url, options));
        break;
    }

    return response;
  }

  @Get('history/topup')
  @UseGuards(AccessTokenGuardGuard)
  async getHistoryTopup(@Req() req: Request, @Res() res) {
    try {
      const path = `/history/topup`;
      const result = await this.forwardRequest('GET', path, req);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('history/topup')
  @UseGuards(AccessTokenGuardGuard)
  async deleteHistoryTopup(@Req() req: Request, @Res() res) {
    try {
      const path = `/history/topup`;
      const result = await this.forwardRequest('DELETE', path, req);
      result;
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete('history/topup/:id')
  @UseGuards(AccessTokenGuardGuard)
  async deleteHistoryTopupById(
    @Req() req: Request,
    @Res() res,
    @Param('id') id: string,
  ) {
    try {
      const path = `/history/topup/${id}`;
      const result = await this.forwardRequest('DELETE', path, req);
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
      const path = `/history/topup/${id}`;
      const result = await this.forwardRequest('GET', path, req);
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
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('history/transfer')
  @UseGuards(AccessTokenGuardGuard)
  async deleteHistoryTransfer(@Req() req: Request, @Res() res) {
    try {
      const path = `/history/transfer`;
      const result = await this.forwardRequest('DELETE', path, req);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('history/transfer/:id')
  @UseGuards(AccessTokenGuardGuard)
  async deleteHistoryTransferById(
    @Req() req: Request,
    @Res() res,
    @Param('id') id: string,
  ) {
    try {
      const path = `/history/transfer/${id}`;
      const result = await this.forwardRequest('DELETE', path, req);
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('history/transfer/:id')
  @UseGuards(AccessTokenGuardGuard)
  async getHistoryTransferById(
    @Req() req: Request,
    @Res() res,
    @Param('id') id: string,
  ) {
    try {
      const path = `/history/transfer/${id}`;
      const result = await this.forwardRequest('GET', path, req);
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
      return res.status(result.status).json(result.data);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
