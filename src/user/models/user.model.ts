import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ERoles } from 'src/auth/constants/roles.constants';
import { EAccountStatus } from '../enums/account-status.enum';

@ObjectType()
export class User {
  @Field(() => ID!)
  _id: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  pass: string;

  @Field(() => [ String ]) 
  roles: ERoles;

  @Field(() => String)
  status: EAccountStatus
}