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
    const { ip, url } = ctx.getRequest<Request>();
    const status = exception.getStatus();

    Logger.error({ ip, url, time: new Date() }, exception.stack);

    const errorBody = {
      trace: exception.stack.split('\n').map(trace => trace.trim()),
    };
    res.status(status).json(errorBody);
  }
}
