import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/user/repositories/user.repository";
import { CreateFundraiserDTO } from "./dtos/create-fundraiser.dto";
import { FundraiserRepository } from "./repositories/fundraiser.repository";

@Injectable()
export class FundraiserService {
    constructor(
        private readonly fundraiserRepo: FundraiserRepository,
        private readonly userRepo: UserRepository
    ) {}

    public async create({ name, purpose, goal } : CreateFundraiserDTO, userId) {
        const [{ organizationId }] = await this.userRepo.find({ _id: userId });
        return await this.fundraiserRepo.create({ 
            name, 
            purpose,
            goal, 
            userId,
            organizationId
        })
    }

    public async getFundraisersByQuery(query:string) {
        if (query ) return this.fundraiserRepo.getAggregatedFundraisersByQuery(query);
        else return this.fundraiserRepo.getAggregatedFundraisers();
    }
}