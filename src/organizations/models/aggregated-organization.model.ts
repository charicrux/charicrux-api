import { Field, ObjectType } from "@nestjs/graphql";
import { ETokenStatus } from "src/token/enums/token-status.enum";
import { Organization } from "./organization.model";

@ObjectType()
export class AggregatedOrganization extends Organization {
};