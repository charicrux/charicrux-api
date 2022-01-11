import { EOrganizationStatus } from "../enums/organization-status.enum";

export interface IOrganization {
    symbol: string,
    name: string,
    description: string,
    status?: EOrganizationStatus,
}