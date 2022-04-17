import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PlatformModule } from './platform/platform.module';
import { AtGuard, OtGuard } from './common/guards';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PrismaModule, PlatformModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OtGuard,
    },
  ],
})
export class AppModule {}
