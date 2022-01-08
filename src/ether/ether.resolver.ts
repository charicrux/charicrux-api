import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { GetGasEstimateDTO } from "./dtos/getGasEstimate.dto";
import { GetGasEstimateModel } from "./models/getGasEstimate.model";
import { EtherService } from "./services/ether.service";

@Resolver()
export class EtherResolver {
    constructor(
        private readonly etherService: EtherService
    ) {}

    @UseGuards(AuthGuard)
    @Query(() => GetGasEstimateModel) 
    public async getGasEstimate(@Args('input') { maxGasUnits }: GetGasEstimateDTO) {
        return this.etherService.estimateContractGasPrice(maxGasUnits);
    }
}