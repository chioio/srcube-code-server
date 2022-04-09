import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreationService } from './creation.service';
import { Creation } from './schema/creation';
import { CreateCreationInput } from './dto/create-creation.input';
import { UpdateCreationInput } from './dto/update-creation.input';
import { CreationsOutput } from './dto/creations.output';
import ConnectionArgs from 'src/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';

@Resolver(() => Creation)
export class CreationResolver {
  constructor(private readonly service: CreationService) {}

  @Mutation(() => Creation)
  createCreation(@Args('input') createCreationInput: CreateCreationInput) {
    return this.service.create(createCreationInput);
  }

  @Query(() => CreationsOutput, { name: 'creations' })
  async creations(
    @Args() args: ConnectionArgs,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<CreationsOutput> {
    const { limit, offset } = args.pagingParams();
    const { creations, count } = await this.service.findAndCount(limit, offset, search);

    const page = connectionFromArraySlice(creations, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return { page, pageData: { count: count, limit, offset } };
  }

  @Query(() => Creation, { name: 'creation' })
  async findOne(@Args('_id', { type: () => String }) _id: string) {
    return await this.service.findOneById(_id);
  }

  @Mutation(() => Boolean)
  updateCreation(@Args('input') updateCreationInput: UpdateCreationInput) {
    return this.service.update(updateCreationInput);
  }

  @Mutation(() => Creation)
  removeCreation(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}
