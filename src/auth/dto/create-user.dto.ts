import { InputType, Field, ID } from "@nestjs/graphql";

@InputType()
export class CreateUserDTO {
  @Field(() => String)
  email: string;
  @Field(() => String)
  pass: string;
  @Field(() => ID!)
  organizationId: string;
}