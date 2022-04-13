import { Module } from '@nestjs/common';
import { ReadmeService } from './readme.service';
import { ReadmeResolver } from './readme.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Readme, ReadmeSchema } from './entities/readme.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Readme.name, schema: ReadmeSchema }]),
  ],
  providers: [ReadmeResolver, ReadmeService],
})
export class ReadmeModule {}
