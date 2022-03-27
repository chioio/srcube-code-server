import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { JWT_SECRET } from '../constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '60m',
      },
    }),
  ],
  providers: [AuthResolver, LocalStrategy, JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
