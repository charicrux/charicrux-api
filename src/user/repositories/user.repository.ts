import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model  } from "mongoose";
import { CreateUserDTO } from "src/auth/dto/create-user.dto";
import { contructUserAggregationPipeline } from "../aggregations/user.aggregation";
import { IUserModel } from "../interfaces/user.interface";


@Injectable()
export class UserRepository {
    constructor(
        @InjectModel('user')
        private readonly userModel: Model<IUserModel>,
    ) {}

    public async create(input:CreateUserDTO) {
        return await this.userModel.create(input);
    }

    public async getAggregatedUser(_id:string) {
        return await this.userModel.aggregate(contructUserAggregationPipeline(_id));
    }
}