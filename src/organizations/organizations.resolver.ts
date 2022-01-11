import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { CreateOrganizationDTO } from "./dtos/create-organization.dto";
import { IOrganization } from "./interfaces/organization.interface";
import { AggregatedOrganization } from "./models/aggregated-organization.model";
import { Organization } from "./models/organization.model";
import { OrganizationsService } from "./organizations.service";

@Resolver(() => Organization)
export class OrganizationsResolver {
    constructor(
        private readonly organizationService: OrganizationsService
    ) {}

    @Query(() => [ AggregatedOrganization ])
    async getAggregatedOrganizations(@Args('query') query: string) : Promise<AggregatedOrganization[]> {
        return await this.organizationService.getAggregatedOrganizations(query);
    }

    @Query(() => [ Organization ])
    async getOrganizations(@Args('query') query: string) : Promise<IOrganization[]> {
        return await this.organizationService.getOrganizations(query);
    }

    @Mutation(() => Boolean)
    async createOrganization(@Args('input') input: CreateOrganizationDTO) : Promise<boolean> {
        return await this.organizationService.create(input);
    }
}