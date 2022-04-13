import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StarService } from './star.service';
import { Star } from './entities/star.entity';
import { CreateStarInput } from './dto/create-star.input';
import { UpdateStarInput } from './dto/update-star.input';

@Resolver(() => Star)
export class StarResolver {
  constructor(private readonly starService: StarService) {}

  @Mutation(() => Star)
  createStar(@Args('createStarInput') createStarInput: CreateStarInput) {
    return this.starService.create(createStarInput);
  }

  @Query(() => Star, { name: 'star', nullable: true })
  findOne(
    @Args('creationId') creationId: string,
    @Args('username') username: string,
  ) {
    return this.starService.findOne(creationId, username);
  }

  @Query(() => [Star], { name: 'stars' })
  findAll(
    @Args('creationId', { type: () => String, nullable: true })
    creationId: string,
    @Args('username', { nullable: true }) username?: string,
  ) {
    return this.starService.findAllByCreationId(creationId, username);
  }

  @Mutation(() => Boolean)
  removeStar(@Args('_id', { type: () => String }) _id: string) {
    return this.starService.remove(_id);
  }

  @Mutation(() => Boolean)
  cancelStar(
    @Args('creationId', { type: () => String }) creationId: string,
    @Args('username') username: string,
  ) {
    return this.starService.removeByUserAndCreationId(username, creationId);
  }
}
