import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signInUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    this.authService = authService;
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterDto) {
    const token = await this.authService.registerUser(registerUserDto);
    return token;
  }

  @Post('login')
  async login(@Body() signInUserDto: SignInDto) {
    return this.authService.signIn(signInUserDto.email, signInUserDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.getUserById(userId);

    return {
      id: user?._id,
      name: user?.name,
      email: user?.email,
    };
  }
}
