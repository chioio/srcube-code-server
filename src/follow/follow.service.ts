import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';
import { Follow, FollowDocument } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(@InjectModel(Follow.name) private model: Model<FollowDocument>) {}

  async create(username: string, following: string) {
    return await new this.model({ username, following }).save();
  }

  async findOne(username: string, following: string) {
    return await this.model.findOne({ username, following });
  }

  async findAndCount(
    limit: number,
    offset: number,
    username?: string,
    following?: string,
  ) {
    const count = await this.model
      .find(username ? { username } : { following })
      .countDocuments();

    const follows = await this.model
      .find(username ? { username } : { following })
      .limit(limit)
      .skip(offset);
    return {
      count,
      follows,
    };
  }

  async remove(username: string, following: string) {
    const res = await this.model.deleteOne({ username, following });

    return res.acknowledged;
  }
}
