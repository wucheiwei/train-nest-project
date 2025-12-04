import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (data) {
    // JWT token 使用 'sub' 作為用戶 ID，但我們可以用 'id' 來訪問它
    if (data === 'id') {
      return user?.sub; // JWT 使用 'sub' 欄位存儲用戶 ID
    }
    return user?.[data];
  }
  return user;
});