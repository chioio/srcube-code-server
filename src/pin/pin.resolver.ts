import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PinService } from './pin.service';
import { Pin } from './entities/pin.entity';

@Resolver(() => Pin)
export class PinResolver {
  constructor(private readonly pinService: PinService) {}

  @Query(() => [Pin], { name: 'pin' })
  findAll() {
    return this.pinService.findAll();
  }

  @Query(() => Pin, { name: 'pin' })
  findOne(@Args('username', { type: () => String }) username: string) {
    return this.pinService.findByUsername(username);
  }

  @Mutation(() => Boolean)
  updatePin(
    @Args('username', { type: () => String }) username: string,
    @Args('creationId', { type: () => String }) creationId: string,
    @Args('pined', { type: () => Boolean }) pined: boolean,
  ) {
    return this.pinService.update(username, creationId, pined);
  }
}
