import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  registerUser(@Body() createUserDto: CreateUserDto) {
    const user = new this.userModel({
      email: createUserDto.email,
      password: createUserDto.password,
      displayName: createUserDto.displayName,
    });

    user.generateToken();

    return user.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: Request) {
    return req.user;
  }

  @Delete('sessions')
  @UseGuards(TokenAuthGuard)
  async logout(@Req() req: Request) {
    const user = req.user as UserDocument;
    const successMessage = { message: 'Successfully logout' };

    user.generateToken();
    await user.save();
    return successMessage;
  }
}
