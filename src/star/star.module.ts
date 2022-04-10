import { Module } from '@nestjs/common';
import { StarService } from './star.service';
import { StarResolver } from './star.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { StarSchema } from './entities/star.entity';
import { CreationModule } from 'src/creation/creation.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Star', schema: StarSchema }]),
    CreationModule,
    UserModule,
  ],
  providers: [StarResolver, StarService],
})
export class StarModule {}
