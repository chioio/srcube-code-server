import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreationService } from './creation.service';
import { Creation } from './schema/creation';
import { CreateCreationInput } from './dto/create-creation.input';
import { UpdateCreationInput } from './dto/update-creation.input';

@Resolver(() => Creation)
export class CreationResolver {
  constructor(private readonly creationService: CreationService) {}

  @Mutation(() => Creation)
  createCreation(@Args('input') createCreationInput: CreateCreationInput) {
    return this.creationService.create(createCreationInput);
  }

  @Query(() => [Creation], { name: 'creations' })
  findAll() {
    return this.creationService.findAll();
  }

  @Query(() => Creation, { name: 'creation' })
  async findOne(@Args('_id', { type: () => String }) _id: string) {
    return await this.creationService.findOneById(_id);
  }

  // @Mutation(() => Creation)
  // updateCreation(
  //   @Args('updateCreationInput') updateCreationInput: UpdateCreationInput,
  // ) {
  //   return this.creationService.update(
  //     updateCreationInput.id,
  //     updateCreationInput,
  //   );
  // }

  @Mutation(() => Creation)
  removeCreation(@Args('id', { type: () => Int }) id: number) {
    return this.creationService.remove(id);
  }
}
