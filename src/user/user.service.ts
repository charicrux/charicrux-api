import { Injectable } from "@nestjs/common";
import { CreateUserDTO } from "src/auth/dto/create-user.dto";
import { UserRepository } from "./repositories/user.repository";
import * as mongoose from "mongoose";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo:UserRepository
    ) {}

    public async findById(userId:string) {
        return await this.userRepo.find({ _id: new mongoose.Types.ObjectId(userId) });
    }

    public async findByEmail(email:string) {
        return await this.userRepo.find<{ email: string }>({ email });
    }

    public async create(fields : CreateUserDTO) {
        return await this.userRepo.create(fields);
    }

    public async getAggregatedUser(_id:string) {
        return await this.userRepo.getAggregatedUser(_id);
    }
}