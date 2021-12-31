import { Injectable } from "@nestjs/common";
import { OrganizationRepository } from "./repositories/organization.repository";

@Injectable()
export class OrganizationsService {
    constructor(
        private readonly organizationRepo: OrganizationRepository
    ) {}

    async getOrganizations(query:string) {
        if (query) return await this.organizationRepo.getOrganizationByQuery(query);
        else return await this.organizationRepo.getOrganizations();
    }
}