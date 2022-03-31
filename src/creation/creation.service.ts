import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { CreateCreationInput } from './dto/create-creation.input';
import { UpdateCreationInput } from './dto/update-creation.input';
import { Creation, CreationDocument } from './schema/creation';

@Injectable()
export class CreationService {
  constructor(
    @InjectModel(Creation.name) private creationModel: Model<CreationDocument>,
  ) {}

  async create(createCreationInput: CreateCreationInput) {
    const createdCreation = new this.creationModel({ ...createCreationInput });
    return await createdCreation.save();
  }

  findAll() {
    return `This action returns all creation`;
  }

  async findOneById(_id: string) {
    return await this.creationModel.findOne({ _id });
  }

  update(id: number, updateCreationInput: UpdateCreationInput) {
    return `This action updates a #${id} creation`;
  }

  remove(id: number) {
    return `This action removes a #${id} creation`;
  }
}
