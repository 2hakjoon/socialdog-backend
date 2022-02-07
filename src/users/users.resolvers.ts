import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/users.entity';

@Resolver((of) => User)
export class UsersResolver {
  @Query((returns) => Boolean)
  testQuery() {
    return true;
  }
}
