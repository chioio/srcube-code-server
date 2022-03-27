import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformResolver } from './platform.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from './schema/work';
import { Category } from './schema/category';

@Module({
  imports: [TypeOrmModule.forFeature([Work, Category])],
  providers: [PlatformResolver, PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}
