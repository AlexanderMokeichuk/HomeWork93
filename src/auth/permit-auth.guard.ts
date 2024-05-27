import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermitAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string>('roles', context.getHandler());

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Not authorized',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (!roles.includes(user.role)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Not authorized',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
