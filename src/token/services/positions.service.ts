import { Injectable } from "@nestjs/common";
import { PositionsRepository } from "../repositories/postions.repository";

@Injectable()
export class PositionsService {
    constructor(
        private readonly positionsRepo: PositionsRepository
    ){}

    public async create(userId, tokenId) {
        await this.positionsRepo.create({ tokenId, userId });
    }

    public async getAggregatedPositions(userId) {
        return await this.positionsRepo.getAggregatedPositions(userId);
    }
}