import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCreationInput } from './dto/create-creation.input';
import { Creation, CreationDocument } from './schema/creation';
import { UpdateCreationInput } from './dto/update-creation.input';
import { StarService } from 'src/star/star.service';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class CreationService {
  constructor(
    @InjectModel(Creation.name) private model: Model<CreationDocument>,
    @Inject(forwardRef(() => StarService))
    private readonly starService: StarService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  async create(createCreationInput: CreateCreationInput) {
    return await new this.model({
      ...createCreationInput,
      stars: 0,
      comments: 0,
    }).save();
  }

  async findAndCount(
    limit: number,
    offset: number,
    search?: string,
  ): Promise<{ creations: Creation[]; count: number }> {
    const count = await this.model
      .find(search ? { title: { $regex: search, $options: 'i' } } : {})
      .countDocuments();

    const creations = await this.model
      .find(search ? { title: { $regex: search, $options: 'i' } } : {})
      .limit(limit)
      .skip(offset);
    return {
      count,
      creations,
    };
  }

  async search(query: string) {
    // search by title
    return await this.model.find({
      title: { $regex: query, $options: 'i' },
    });
  }

  async findOneById(_id: string) {
    return await this.model.findOne({ _id });
  }

  async findOneByIdAndUpdate(_id: string, update: Object) {
    return await this.model.findByIdAndUpdate(_id, update);
  }

  async update(updateCreationInput: UpdateCreationInput): Promise<Boolean> {
    const res = await this.model.updateOne(
      { _id: updateCreationInput._id },
      { ...updateCreationInput },
    );

    return res.acknowledged;
  }

  async remove(_id: string): Promise<Boolean> {
    const deleteStar = await this.starService.removeAllByCreationId(_id);
    const deleteComment = await this.commentService.removeAllByCreationId(_id);

    if (deleteStar && deleteComment) {
      return (await this.model.deleteOne({ _id })).acknowledged;
    }
    return false;
  }
}
