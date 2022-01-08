import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model  } from "mongoose";
import { getAggregatedToken } from "../aggregations/token.aggregation";
import { ITokenModel } from "../interfaces/token.interface";

@Injectable()
export class TokenRespository { 
    constructor(
        @InjectModel('token')
        private readonly tokenModel: Model<ITokenModel>,
    ) {}

    public async getAggregatedToken(tokenId:string) {
        return await this.tokenModel.aggregate(getAggregatedToken(tokenId));
    }

    public async updateByOrganizationId(organizationId:string, update:any) {
        return await this.tokenModel.updateOne({ organizationId, }, { $set: update });
    }  

    public async create(organizationId:string, contractHash:string) {
        return await this.tokenModel.create({ organizationId, contractHash });
    }
}