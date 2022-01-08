import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetGasEstimateDTO {
    @Field(() => Number)
    maxGasUnits: number; 
}