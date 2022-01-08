import { IS3Object } from "src/aws/interfaces/s3Object.interface";

export interface IContractModel { 
    contractHash: string; 
    aws: IS3Object
}