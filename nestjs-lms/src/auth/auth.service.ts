import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registerUserDto: RegisterDto) {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(
      registerUserDto.password,
      saltRounds,
    );

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hashPassword,
    });

    const payload = { userId: user._id };
    const token = await this.jwtService.signAsync(payload);

    console.log('Token: ', token);

    return { access_token: token };
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    
  }
}
