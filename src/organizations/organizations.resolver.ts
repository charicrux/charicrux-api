import { Args, Resolver, Query } from "@nestjs/graphql";
import { IOrganization } from "./interfaces/organization.interface";
import { Organization } from "./models/organization.model";
import { OrganizationsService } from "./organizations.service";

@Resolver(() => Organization)
export class OrganizationsResolver {
    constructor(
        private readonly organizationService: OrganizationsService
    ) {}

    @Query(() => [ Organization ])
    async getOrganizations(@Args('query') query: string) : Promise<IOrganization[]> {
        return await this.organizationService.getOrganizations(query);
    }
}