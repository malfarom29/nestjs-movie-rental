import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly env: string) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const ip = ctx.getRequest().headers['x-forwarded-for'];

    console.log(req.ip);
    console.log(ip);

    res.status(status).json(exception.getResponse());
  }
}
