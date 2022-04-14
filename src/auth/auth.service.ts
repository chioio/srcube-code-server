import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-identicon-sprites';
import { AuthHelper } from './auth.helper';
import { UserService } from '../user/user.service';
import { SignInInput, SignInOutput } from './dto/sign-in.dto';
import { SignUpInput, SignUpOutput } from './dto/sign-up.dto';
import { User } from 'src/user/schema/user';
import {
  AccountType,
  ExistedCheckInput,
  ExistedCheckOutput,
} from './dto/common.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  findUserById(userId: string) {
    return this.userService.findById(userId);
  }

  async validateUser(username: string) {
    await this.userService.findOneByUsername(username);
  }

  async whoAmI(user: User) {
    return await this.userService.findOneByUsername(user.username);
  }

  async existedCheck(input: ExistedCheckInput): Promise<ExistedCheckOutput> {
    if (input.type === AccountType.EMAIL) {
      return { result: !!(await this.userService.findOneByEmail(input.value)) };
    }
    if (input.type === AccountType.USERNAME) {
      return {
        result: !!(await this.userService.findOneByUsername(input.value)),
      };
    }
  }

  async signIn(input: SignInInput): Promise<SignInOutput> {
    const { password, ...profile } =
      input.type === 'email'
        ? await this.userService.findOneByEmail(input.account)
        : await this.userService.findOneByUsername(input.account);
    // * There not need to judge, because the account has been checked for existence.
    // if (!user) {
    //   throw new UnauthorizedException();
    // }

    const isPasswordValid = await AuthHelper.validate(input.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({ message: 'Password invalid!' });
    }

    Logger.log(profile, 'AuthService.signIn');

    return {
      token: this.jwtService.sign({
        userId: profile._id,
        user: profile.username,
      }),
      profile: profile,
    };
  }

  signOut() {
    throw new Error('Method not implemented.');
  }

  async signUp(input: SignUpInput): Promise<SignUpOutput> {
    const password = await AuthHelper.encrypt(input.password);
    const svg = createAvatar(style, { seed: input.username, dataUri: true });

    const user = await this.userService.create({
      ...input,
      avatar: svg,
      password: password,
    });

    if (!user) {
      throw new Error('Create user failed');
    }

    return { user: user.username };
  }
}
