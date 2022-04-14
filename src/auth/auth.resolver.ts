import { UseGuards, Logger } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignInOutput } from './dto/sign-in.dto';
import { SignOutOutput } from './dto/sign-out.dto';
import { SignUpInput, SignUpOutput } from './dto/sign-up.dto';
import { ExistedCheckInput, ExistedCheckOutput } from './dto/common.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/ctx-user.decorator';
import { User } from '../user/schema/user';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    Logger.log('Authored', 'AuthResolver');
    return this.service.whoAmI(user);
  }

  @Query(() => ExistedCheckOutput)
  existedCheck(@Args('input') input: ExistedCheckInput) {
    return this.service.existedCheck(input);
  }

  @Mutation(() => SignInOutput)
  signIn(@Args('input') input: SignInInput) {
    return this.service.signIn(input);
  }

  @Mutation(() => SignOutOutput)
  signOut() {
    return this.service.signOut();
  }

  @Mutation(() => SignUpOutput)
  signUp(@Args('input') input: SignUpInput) {
    return this.service.signUp(input);
  }
}
