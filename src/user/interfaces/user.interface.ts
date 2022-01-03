import { EAccountStatus } from "../enums/account-status.enum";

export interface IUserModel {
    _id: string,
    email: string; 
    roles: string[];
    pass?: string; 
    firstName?: string;
    lastName?: string; 
    avatar?:string;
    status?: EAccountStatus,
    emailVerified?: boolean,
}