import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStarInput } from './dto/create-star.input';
import { Star, StarDocument } from './entities/star.entity';
import { CreationService } from 'src/creation/creation.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StarService {
  constructor(
    @InjectModel(Star.name) private model: Model<StarDocument>,

    @Inject(forwardRef(() => CreationService))
    private creationService: CreationService,
    private userService: UserService,
  ) {}

  async create(createStarInput: CreateStarInput) {
    const user = await this.userService.findOneByUsername(
      createStarInput.username,
    );

    const res = await new this.model({
      ...createStarInput,
      user: {
        title: `${user.firstName} ${user.lastName}`,
        username: user.username,
        avatar: user.avatar,
      },
    }).save();

    if (res) {
      await this.creationService.findOneByIdAndUpdate(
        createStarInput.creationId,
        { $inc: { stars: 1 } },
      );
    }

    return res;
  }

  async findOne(creationId: string, username: string) {
    return await this.model.findOne({
      creationId: creationId,
      username: username,
    });
  }

  async findAll() {
    return await this.model.find();
  }

  async findAllByCreationId(creationId: string, username?: string) {
    const stars = await this.model.find(
      username ? { creationId, username } : { creationId },
    );
    return stars;
  }

  async removeAllByCreationId(creationId: string): Promise<Boolean> {
    return (await this.model.deleteMany({ creationId })).acknowledged;
  }

  async remove(_id: string) {
    const star = await this.model.findOne({ _id });
    await this.creationService.findOneByIdAndUpdate(star.creationId, {
      $inc: { stars: -1 },
    });

    const res = await this.model.deleteOne({ _id });

    return res.acknowledged;
  }

  async removeByUserAndCreationId(username: string, creationId: string) {
    const star = await this.model.findOne({
      username: username,
      creationId: creationId,
    });
    await this.creationService.findOneByIdAndUpdate(star.creationId, {
      $inc: { stars: -1 },
    });

    const res = await this.model.deleteOne({
      username: username,
      creationId: creationId,
    });

    return res.acknowledged;
  }
}
