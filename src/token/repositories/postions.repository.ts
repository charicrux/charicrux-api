import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model  } from "mongoose";
import { getPositionsAggregations } from "../aggregations/positions.aggregation";
import { IPositionsModel } from "../interfaces/positions.interface";

@Injectable()
export class PositionsRepository {
    constructor(
        @InjectModel("position")
        private readonly positionsModel : Model<IPositionsModel>
    ){}

    public async create(doc:IPositionsModel) {
        return await this.positionsModel.create({ ...doc });
    }

    public async getAggregatedPositions(userId) {
        return await this.positionsModel.aggregate(getPositionsAggregations(userId))
    }
}