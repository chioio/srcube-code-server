import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCommentInput } from './dto/update-comment.input';
import { CreationService } from 'src/creation/creation.service';
import { UserService } from 'src/user/user.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly model: Model<Comment>,
    @Inject(forwardRef(() => CreationService))
    private readonly creationService: CreationService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createCommentInput: CreateCommentInput) {
    const user = await this.userService.findOneByUsername(
      createCommentInput.commenter,
    );

    const res = await new this.model({
      ...createCommentInput,
      commenter: {
        title: `${user.firstName} ${user.lastName}`,
        username: user.username,
        avatar: user.avatar,
      },
    }).save();

    if (res) {
      await this.creationService.findOneByIdAndUpdate(
        createCommentInput.creationId,
        { $inc: { comments: 1 } },
      );
    }

    return res;
  }

  async findByCreationId(creationId: string) {
    return await this.model.find({ creationId });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`;
  }

  async removeAllByCreationId(_id: string): Promise<Boolean> {
    return (await this.model.deleteMany({ _id })).acknowledged;
  }

  async remove(_id: string): Promise<Boolean> {
    return (await this.model.deleteOne({ _id })).acknowledged;
  }
}
