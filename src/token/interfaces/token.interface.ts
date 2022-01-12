import { ETokenNetwork } from "../enums/token-network.enum";
import { ETokenStatus } from "../enums/token-status.enum";

export interface ITokenModel {
    address:string | null; 
    organizationId: string;
    status: ETokenStatus;
    contractHash: string,
    network: ETokenNetwork,
}