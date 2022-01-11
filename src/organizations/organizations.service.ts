import { Injectable } from "@nestjs/common";
import { CreateOrganizationDTO } from "./dtos/create-organization.dto";
import { OrganizationRepository } from "./repositories/organization.repository";

@Injectable()
export class OrganizationsService {
    constructor(
        private readonly organizationRepo: OrganizationRepository
    ) {}

    async getAggregatedOrganizations(query:string) {
        if (query) return await this.organizationRepo.getAggregatedOrganizationsByQuery(query);
        return await this.organizationRepo.getAggregatedOrganizations();
    }

    async getOrganizations(query:string) {
        if (query) return await this.organizationRepo.getOrganizationByQuery(query);
        else return await this.organizationRepo.getOrganizations();
    }

    async create({ name, email, symbol, description }:CreateOrganizationDTO) : Promise<boolean> {
        const response = await this.organizationRepo.create({ 
            name, 
            symbol,
            description,
        }).catch(() => null);
        return !!response; 
    }
}