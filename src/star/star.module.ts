import { forwardRef, Module } from '@nestjs/common';
import { StarService } from './star.service';
import { StarResolver } from './star.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Star, StarSchema } from './entities/star.entity';
import { UserModule } from 'src/user/user.module';
import { CreationModule } from 'src/creation/creation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Star.name, schema: StarSchema }]),
    UserModule,
    forwardRef(() => CreationModule),
  ],
  providers: [StarResolver, StarService],
  exports: [StarService, MongooseModule],
})
export class StarModule {}
