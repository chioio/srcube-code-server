import { Module } from '@nestjs/common';
import { CreationService } from './creation.service';
import { CreationResolver } from './creation.resolver';
import { Creation, CreationSchema } from './schema/creation';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Creation.name, schema: CreationSchema },
    ]),
  ],
  providers: [CreationResolver, CreationService],
  exports: [CreationService],
})
export class CreationModule {}
