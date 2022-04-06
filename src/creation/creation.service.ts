import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCreationInput } from './dto/create-creation.input';
import { Creation, CreationDocument } from './schema/creation';
import { UpdateCreationInput } from './dto/update-creation.input';
import { UpdateResult } from 'mongodb';

@Injectable()
export class CreationService {
  constructor(
    @InjectModel(Creation.name) private model: Model<CreationDocument>,
  ) {}

  async create(createCreationInput: CreateCreationInput) {
    return await new this.model({ ...createCreationInput }).save();
  }

  async findCreations(limit: number, offset: number): Promise<Creation[]> {
    return await this.model.find({}).limit(limit).skip(offset)
  }

  findAll() {
    return `This action returns all creation`;
  }

  async findOneById(_id: string) {
    return await this.model.findOne({ _id });
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
