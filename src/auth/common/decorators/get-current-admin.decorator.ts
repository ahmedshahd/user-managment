import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentAdmin = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const admin = request.admin;
    if (!data) return admin;
    return request.admin[data];
  },
);
