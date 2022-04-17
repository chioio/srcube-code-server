import { OtStrategy } from './strategies/ot.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { AtStrategy, RtStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, OtStrategy],
})
export class AuthModule {}
