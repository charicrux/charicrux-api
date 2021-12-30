import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateUserDTO {
  @Field()
  email: string;
  @Field()
  pass: string;
}