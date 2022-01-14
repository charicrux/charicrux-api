import { Field, ObjectType } from "@nestjs/graphql";
import { IOrganization } from "src/organizations/interfaces/organization.interface";
import { Organization } from "src/organizations/models/organization.model";
import { ITokenModel } from "../interfaces/token.interface";
import { PositionsModel } from "./positions.model";
import { TokenModel } from "./token.model";

@ObjectType()
export class AggregatedPositionsModel extends PositionsModel {
    @Field(() => TokenModel)
    token: ITokenModel; 
    @Field(() => Organization)
    organization: IOrganization;
}