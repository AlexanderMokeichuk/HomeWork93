import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const headerValue = request.get('Authorization');

    const [_, token] = headerValue.split(' ');

    if (!token) {
      return false;
    }

    const user = await this.userModel.findOne({ token: token });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Wrong token',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    request.user = user;

    return true;
  }
}
