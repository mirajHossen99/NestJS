import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './Schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(registerUserDto: RegisterDto) {
    const { name, email, password } = registerUserDto;

    try {
      return await this.userModel.create({
        name: name,
        email: email,
        password: password,
      });
    } catch (error: unknown) {
      // console.log(error);

      const err = error as { code?: number };
      const DUPLICATE_KEY_CODE = 11000;

      if (err.code === DUPLICATE_KEY_CODE) {
        throw new ConflictException('Email is already taken');
      }

      throw error;
    }
  }
}
