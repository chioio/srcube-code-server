import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCreationInput } from './dto/create-creation.input';
import { Creation, CreationDocument } from './schema/creation';
import { UpdateCreationInput } from './dto/update-creation.input';

@Injectable()
export class CreationService {
  constructor(
    @InjectModel(Creation.name) private model: Model<CreationDocument>,
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
    const res = await this.model.findByIdAndUpdate(_id, update);
  }

  async update(updateCreationInput: UpdateCreationInput): Promise<Boolean> {
    const res = await this.model.updateOne(
      { _id: updateCreationInput._id },
      { ...updateCreationInput },
    );

    return res.acknowledged;
  }

  remove(id: number) {
    return `This action removes a #${id} creation`;
  }
}
