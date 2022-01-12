import { EFundraiserStatus } from "../enums/fundraiser-status.enum";

export class IFundraiserModel {
    name: string; 
    purpose: string; 
    goal: number; 
    organizationId: string; 
    userId: string; 
    status?: EFundraiserStatus
}