import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model  } from "mongoose";
import { getAggregatedToken } from "../aggregations/token.aggregation";
import { ITokenModel } from "../interfaces/token.interface";
import * as mongoose from "mongoose";
import config from "src/config";
@Injectable()
export class TokenRespository { 
    constructor(
        @InjectModel('token')
        private readonly tokenModel: Model<ITokenModel>,
    ) {}

    public async findByTokenId(tokenId) {
        return await this.tokenModel.findById(tokenId);
    }   

    public async deleteByOrganizationId(organizationId) {
        return await this.tokenModel.deleteOne({ organizationId: new mongoose.Types.ObjectId(organizationId),  network: config.etherNetwork})
    }

    public async getAggregatedToken(organizationId:string) {
        const $match = { organizationId: new mongoose.Types.ObjectId(organizationId), network: config.etherNetwork};
        return await this.tokenModel.aggregate(getAggregatedToken($match));
    }

    public async updateByOrganizationId(organizationId:string, update:any) {
        return await this.tokenModel.updateOne({ organizationId, network: config.etherNetwork }, { $set: update });
    }  

    public async create(organizationId:string, contractHash:string) {
        return await this.tokenModel.create({ organizationId, contractHash });
    }
}