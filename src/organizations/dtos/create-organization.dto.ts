import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateOrganizationDTO {
    @Field(() => String)
    name: string; 
    @Field(() => String)
    symbol: string;
    @Field(() => String)
    description: string;; 
    @Field(() => String)
    email: string; 
}