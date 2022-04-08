import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStarInput } from './dto/create-star.input';
import { UpdateStarInput } from './dto/update-star.input';
import { Star, StarDocument } from './entities/star.entity';
import { CreationService } from 'src/creation/creation.service';

@Injectable()
export class StarService {
  constructor(
    @InjectModel(Star.name) private model: Model<StarDocument>,
    private readonly creationService: CreationService,
  ) {}

  async create(createStarInput: CreateStarInput) {
    await this.creationService.findOneByIdAndUpdate(
      createStarInput.creationId,
      { $inc: { stars: 1 } },
    );

    return await new this.model({ ...createStarInput }).save();
  }

  async findAll() {
    return await this.model.find();
  }

  async findAllByCreationId(creationId: string, username?: string) {
    return await this.model.find(
      username ? { creationId, username } : { creationId },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} star`;
  }

  update(id: number, updateStarInput: UpdateStarInput) {
    return `This action updates a #${id} star`;
  }

  async remove(_id: string) {
    const star = await this.model.findOne({ _id });
    await this.creationService.findOneByIdAndUpdate(star.creationId, {
      $inc: { stars: -1 },
    });

    const res = await this.model.deleteOne({ _id });

    return res.acknowledged;
  }
}
