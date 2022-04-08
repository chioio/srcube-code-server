import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { CreationModule } from './creation/creation.module';
import { StarModule } from './star/star.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/srcube-code'),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault],
    }),
    UserModule,
    AuthModule,
    CreationModule,
    StarModule,
  ],
})
export class AppModule {}
