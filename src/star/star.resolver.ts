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

  @Query(() => [Star], { name: 'stars' })
  findAll(
    @Args('creationId', { type: () => String }) creationId: string,
    @Args('username', { nullable: true }) username?: string,
  ) {
    return this.starService.findAllByCreationId(creationId, username);
  }

  // @Query(() => Star, { name: 'star' })
  // findOne(@Args('id', { type: () => String }) id: string) {
  //   return this.starService.findOne(id);
  // }

  @Mutation(() => Star)
  updateStar(@Args('updateStarInput') updateStarInput: UpdateStarInput) {
    return this.starService.update(updateStarInput.id, updateStarInput);
  }

  @Mutation(() => Boolean)
  removeStar(@Args('_id', { type: () => String }) _id: string) {
    return this.starService.remove(_id);
  }
}
