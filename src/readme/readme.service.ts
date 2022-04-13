import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Readme, ReadmeDocument } from './entities/readme.entity';

@Injectable()
export class ReadmeService {
  constructor(@InjectModel(Readme.name) private model: Model<ReadmeDocument>) {}

  async findOne(username: string) {
    return await this.model.findOne({ username });
  }

  async update(username: string, content?: string) {
    const readme = await this.model.findOne({ username });

    if (!readme) {
      // create one
      return new this.model({
        user: username,
        content: content || '**Hi! Here 👋**',
      }).save();
    } else {
      return await this.model.findOneAndUpdate(
        { user: username },
        { content: content || '**Hi! Here 👋**' },
      );
    }
  }

  async remove(username: string) {
    return await this.model.findOneAndRemove({ user: username });
  }
}
