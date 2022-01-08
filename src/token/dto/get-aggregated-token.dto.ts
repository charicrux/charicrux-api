import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class GetAggregatedTokenDTO {
    @Field(() => ID!)
    organizationId: string; 
}