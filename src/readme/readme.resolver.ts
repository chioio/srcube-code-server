import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReadmeService } from './readme.service';
import { Readme } from './entities/readme.entity';

@Resolver(() => Readme)
export class ReadmeResolver {
  constructor(private readonly readmeService: ReadmeService) {}

  @Query(() => Readme, { name: 'readme', nullable: true })
  findOne(@Args('username', { type: () => String }) username: string) {
    return this.readmeService.findOne(username);
  }

  @Mutation(() => Readme)
  updateReadme(
    @Args('username', { type: () => String }) username: string,
    @Args('content', { type: () => String, nullable: true }) content?: string,
  ) {
    return this.readmeService.update(username, content);
  }

  @Mutation(() => Readme)
  removeReadme(@Args('username', { type: () => String }) username: string) {
    return this.readmeService.remove(username);
  }
}
