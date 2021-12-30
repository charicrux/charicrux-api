import { Injectable } from "@nestjs/common";
import { CreateUserDTO } from "src/auth/dto/create-user.dto";
import { UserRepository } from "./user.repository";


@Injectable()
export class UserService {
    constructor(
        private readonly userRepo:UserRepository
    ) {}

    public async create(fields : CreateUserDTO) {
        return await this.userRepo.create(fields);
    }

    public async getAggregatedUser(_id:string) {
        return await this.userRepo.getAggregatedUser(_id);
    }
}