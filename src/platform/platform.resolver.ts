import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PlatformService } from './platform.service';
import { CreateWorkInput } from './dto/work.dto';
import { UpdateWorkInput } from './dto/update-work.input';
import { Work } from './schema/work';

@Resolver(() => Work)
export class PlatformResolver {
  constructor(private readonly workService: PlatformService) {}

  @Mutation(() => Work)
  createWork(@Args('createWorkInput') createWorkInput: CreateWorkInput) {
    return this.workService.createWork(createWorkInput);
  }

  @Query(() => [Work], { name: 'work' })
  findAll() {
    return this.workService.findAll();
  }

  @Query(() => Work, { name: 'work' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.workService.findOne(id);
  }

  @Mutation(() => Work)
  updateWork(@Args('updateWorkInput') updateWorkInput: UpdateWorkInput) {
    return this.workService.update(updateWorkInput.id, updateWorkInput);
  }

  @Mutation(() => Work)
  removeWork(@Args('id', { type: () => Int }) id: number) {
    return this.workService.remove(id);
  }
}
