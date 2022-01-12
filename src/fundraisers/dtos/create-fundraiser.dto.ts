import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateFundraiserDTO {
    @Field(() => String)
    name: string
    @Field(() => String)
    purpose: string; 
    @Field(() => Number)
    goal: number; 
}