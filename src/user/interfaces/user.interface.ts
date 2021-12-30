import { EAccountStatus } from "../enums/account-status.enum";

export interface IUserModel {
    email: string; 
    roles: string[];
    pass?: string; 
    firstName?: string;
    lastName?: string; 
    avatar?:string;
    status?: EAccountStatus,
    emailVerified?: boolean,
}