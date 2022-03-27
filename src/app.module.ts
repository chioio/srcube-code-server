import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PlatformModule } from './platform/platform.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      database: 'srcube-code',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault],
    }),
    UserModule,
    AuthModule,
    PlatformModule,
  ],
})
export class AppModule {}
