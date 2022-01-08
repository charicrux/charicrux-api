import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GetGasEstimateModel {
    @Field(() => Number)
    gasCostETH: number; 
    @Field(() => Number) 
    maxGasCostETH: number;  
}