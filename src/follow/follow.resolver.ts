import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { Follow } from './entities/follow.entity';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';
import ConnectionArgs from 'src/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { FollowsOutput } from './dto/follows.output';

@Resolver(() => Follow)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => Follow)
  async createFollow(
    @Args('username') username: string,
    @Args('following') following: string,
  ) {
    return await this.followService.create(username, following);
  }

  @Query(() => Follow, { nullable: true })
  async follow(
    @Args('username') username: string,
    @Args('following') following: string,
  ) {
    return await this.followService.findOne(username, following);
  }

  @Query(() => FollowsOutput)
  async follows(
    @Args() args: ConnectionArgs,
    @Args('username', { nullable: true }) username?: string,
    @Args('following', { nullable: true }) following?: string,
  ): Promise<FollowsOutput> {
    const { limit, offset } = args.pagingParams();
    const { follows, count } = await this.followService.findAndCount(
      limit,
      offset,
      username,
      following,
    );

    const page = connectionFromArraySlice(follows, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return { page, pageData: { count: count, limit, offset } };
  }

  @Mutation(() => Boolean)
  removeFollow(
    @Args('username') username: string,
    @Args('following') following: string,
  ) {
    return this.followService.remove(username, following);
  }
}
