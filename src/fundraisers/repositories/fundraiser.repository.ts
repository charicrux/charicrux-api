import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model  } from "mongoose";
import { getFundraiserAggregation } from "../aggregations/fundraiser.aggregation";
import { IFundraiserModel } from "../interfaces/fundraiser.interface";

@Injectable()
export class FundraiserRepository {
    constructor(
        @InjectModel('fundraiser')
        private readonly fundraiserModel: Model<IFundraiserModel>,
    ) {}

    public async create(doc:IFundraiserModel) {
        return await this.fundraiserModel.create({ ...doc });
    }

    public async getAggregatedFundraisers() {
        return await this.fundraiserModel.aggregate(getFundraiserAggregation({}));
    }
    public async getAggregatedFundraisersByQuery(query:string) {
        const $match = { $text: { $search: query }};
        return await this.fundraiserModel.aggregate(getFundraiserAggregation($match));
    }
}