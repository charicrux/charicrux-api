import { Field, ObjectType } from "@nestjs/graphql";
import { Organization } from "src/organizations/models/organization.model";
import { FundraiserModel } from "./fundraiser.model";

@ObjectType()
export class AggregatedFundraiserModel extends FundraiserModel {
    @Field(() => Organization)
    organization: Organization;
}