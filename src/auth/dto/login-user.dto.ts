import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class LoginUserDTO {
  @Field()
  email: string;
  @Field()
  pass: string;
}