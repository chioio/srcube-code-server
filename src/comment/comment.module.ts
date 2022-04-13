import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CreationModule } from 'src/creation/creation.module';
import { UserModule } from 'src/user/user.module';
import { CommentSchema, Comment } from './entities/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UserModule,
    forwardRef(() => CreationModule),
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService, MongooseModule],
})
export class CommentModule {}
