import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model  } from "mongoose";
import { IContractModel } from "../interfaces/contract.interface";

@Injectable()
export class ContractRepository {
    constructor(
        @InjectModel("contract")
        private readonly contractModel : Model<IContractModel>
    ){}

    public async findByContractHash(contractHash:string) { 
        return await this.contractModel.findOne({ contractHash });
    }

    public async create(doc:IContractModel) {
        return await this.contractModel.create(doc);
    }
}