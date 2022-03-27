import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './schema/user';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('username', { type: () => String }) username: string) {
    return this.service.findOneByUsername(username);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.service.create(createUserInput);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.service.update(updateUserInput.id, updateUserInput);
  }

  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.remove(id);
  // }
}
