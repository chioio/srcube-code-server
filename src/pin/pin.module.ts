import { Module } from '@nestjs/common';
import { PinService } from './pin.service';
import { PinResolver } from './pin.resolver';
import { PinSchema } from './entities/pin.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Pin', schema: PinSchema }])],
  providers: [PinResolver, PinService],
})
export class PinModule {}
