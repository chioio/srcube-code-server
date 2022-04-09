import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pin, PinDocument } from './entities/pin.entity';

@Injectable()
export class PinService {
  constructor(@InjectModel(Pin.name) private model: Model<PinDocument>) {}

  async create(username: string, creationIds: string[] = []) {
    return await new this.model({ username, creationIds }).save();
  }

  findAll() {
    return `This action returns all pin`;
  }

  async findByUsername(username: string): Promise<Pin> {
    return await this.model.findOne({ username });
  }

  async update(
    username: string,
    creationId: string,
    state: boolean,
  ): Promise<Boolean> {
    const pin = await this.model.findOne({ username });

    if (pin) {
      if (state) {
        if (pin.creationIds.length >= 6) return false;
        const res = await this.model.updateOne(
          { username },
          { $addToSet: { creationIds: creationId } },
        );
        return res.acknowledged;
      } else {
        const res = await this.model.updateOne(
          { username },
          { $pull: { creationIds: creationId } },
        );
        return res.acknowledged;
      }
    } else {
      return !!(await this.create(username, [creationId]));
    }
  }

  async remove(username: string, creationId: string): Promise<Boolean> {
    const res = await this.model.updateOne(
      { username },
      { $pull: { creationIds: creationId } },
    );
    return res.acknowledged;
  }
}
