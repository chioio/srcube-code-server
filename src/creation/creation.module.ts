import { forwardRef, Module } from '@nestjs/common';
import { CreationService } from './creation.service';
import { CreationResolver } from './creation.resolver';
import { Creation, CreationSchema } from './schema/creation';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from 'src/comment/comment.service';
import { StarService } from 'src/star/star.service';
import { CommentModule } from 'src/comment/comment.module';
import { StarModule } from 'src/star/star.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Creation.name, schema: CreationSchema },
    ]),
    UserModule,
    forwardRef(() => StarModule),
    forwardRef(() => CommentModule),
  ],
  providers: [CreationResolver, CreationService],
  exports: [CreationService],
})
export class CreationModule {}
