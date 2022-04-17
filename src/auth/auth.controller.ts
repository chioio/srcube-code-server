import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';

import { CurrentUser, Public } from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import {
  TExistedCheckDto,
  TSignUpDto,
  TSignInDto,
  TExistedCheckVo,
  TTokensVo,
} from './typings';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // whoami
  @UseGuards(AtGuard)
  @Get('/whoami')
  @HttpCode(HttpStatus.OK)
  async whoami(@CurrentUser('user') user: string) {
    return this.authService.whoami(user);
  }

  // existed check
  @Public()
  @Post('existed-check')
  @HttpCode(HttpStatus.OK)
  async existedCheck(@Body() dto: TExistedCheckDto): Promise<TExistedCheckVo> {
    return this.authService.existedCheck(dto);
  }

  // signup
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: TSignUpDto): Promise<TTokensVo> {
    return this.authService.signup(dto);
  }

  // signin
  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: TSignInDto): Promise<TTokensVo> {
    return this.authService.signin(dto);
  }

  // logout
  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('user') user: string) {
    return this.authService.logout(user);
  }

  // refresh
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser('user') user: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(user, refreshToken);
  }
}
