import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ES3Buckets } from "src/aws/enums/s3Buckets.enum";
import { S3Service } from "src/aws/services/s3.service";
import config from "src/config";
import { IContractModel } from "../interfaces/contract.interface";
import { ContractRepository } from "../repositories/contract.repository";
const fs = require("fs/promises");

@Injectable()
export class ContractService {
    constructor(
        private readonly contractRepository: ContractRepository,
        private readonly s3Service: S3Service,
    ) {}

    public async deleteTempContract(absolutePath:string) {
        await fs.unlink(absolutePath, (err) => {
            if (err) {
                console.error(err)
                return
            }
        });
    }

    public async create(contractHash:string, contractBuffer:Buffer) {
        const upload : any = await this.s3Service.uploadPrivateObject({
            bucketName: config.aws.s3.buckets[ES3Buckets.TOKEN_TEMPLATES], 
            buffer: contractBuffer,
            key: `${contractHash}.sol`,
        }).catch(_ => null);

        if (!upload) {
            throw new InternalServerErrorException("Failed to Create Contract Record");
        }

        return await this.contractRepository.create({ 
            contractHash, 
            aws: { bucket: upload.Bucket, key: upload.Key }
        } as IContractModel).catch(_ => null);
    }
}