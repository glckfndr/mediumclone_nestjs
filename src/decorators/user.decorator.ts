/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: ExpressRequestInterface = ctx.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
