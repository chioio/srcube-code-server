import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

import { PrismaService } from '../prisma/prisma.service';
import { EncryptedHelper, PrismaHelper } from 'src/common/helpers';
import {
  TWhoAmI,
  TExistedCheckDto,
  TExistedCheckVo,
  EAccountType,
  TSignUpDto,
  TTokensVo,
  TSignInDto,
} from './typings';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // whoami
  async whoami(username: string): Promise<TWhoAmI> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        user_image: true,
      },
    });

    PrismaHelper.exclude(user.user_image, 'id', 'created_at', 'updated_at');

    const safetyUser = PrismaHelper.exclude(
      user,
      'password',
      'hashed_rt',
      'created_at',
      'updated_at',
    );

    return safetyUser;
  }

  // get tokens
  async getTokens(userId: string, username: string) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, user: username },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwt.signAsync(
        { sub: userId, user: username },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: '1d',
        },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  // update refresh token
  async updateRtHash(userId: string, rt: string) {
    const hash = await EncryptedHelper.encrypt(rt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashed_rt: hash },
    });
  }

  // existed check
  async existedCheck({
    type,
    value,
  }: TExistedCheckDto): Promise<TExistedCheckVo> {
    const isExisted =
      type === EAccountType.USERNAME
        ? !!(await this.prisma.user.findUnique({
            where: { username: value },
          }))
        : !!(await this.prisma.user.findUnique({
            where: { email: value },
          }));

    return { isExisted };
  }

  // signup
  async signup(input: TSignUpDto): Promise<TTokensVo> {
    // Not need to check account because it's already checked in the frontend
    // const user = await this.prisma.user.findUnique({
    //   where: { username: input.username },
    // });

    // if (user) throw new UnauthorizedException('Username already exists');

    const avatar = createAvatar(style, {
      seed: input.username,
      size: 128,
      dataUri: true,
    });

    const newUser = await this.prisma.user.create({
      data: {
        ...input,
        password: await EncryptedHelper.encrypt(input.password),
        user_image: {
          create: {
            avatar,
            banner: '',
          },
        },
        readme: {
          create: {
            content: 'Hi there! 👋',
          },
        },
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.username);

    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  // Login
  async signin(input: TSignInDto): Promise<TTokensVo> {
    const user =
      input.type === EAccountType.USERNAME
        ? await this.prisma.user.findUnique({
            where: { username: input.account },
          })
        : await this.prisma.user.findUnique({
            where: { email: input.account },
          });

    // const user = await this.prisma.user.findUnique({
    //   where: {
    //     username: 'admin',
    //   },
    // });

    // Not need to check account because it's already checked in the frontend
    // if (!user) throw new UnauthorizedException('Invalid password!');

    const isPasswordValid = await EncryptedHelper.validate(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password.');
    }

    Logger.log(`User ${user.username} logged in.`, 'AuthService');

    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  // Logout
  async logout(username: string) {
    const res = await this.prisma.user.update({
      where: {
        username,
      },
      data: { hashed_rt: null },
    });

    Logger.log(`User ${res.username} logged out.`, 'AuthService');
  }

  // Refresh
  async refresh(username: string, rt: string): Promise<TTokensVo> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user || !user.hashed_rt)
      throw new UnauthorizedException('Unauthorized! Please sign in again.');

    const isRtValid = await EncryptedHelper.validate(rt, user.hashed_rt);

    if (!isRtValid)
      throw new UnauthorizedException('Unauthorized! Please sign in again.');

    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRtHash(user.id, tokens.refresh_token);

    Logger.log(`User ${user.username} refreshed token.`, 'AuthService');

    return tokens;
  }
}
