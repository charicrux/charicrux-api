import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IOrganization } from "src/organizations/interfaces/organization.interface";
import { IUserModel } from "src/user/interfaces/user.interface";
import { UserService } from "src/user/user.service";
import { EtherService } from "../../ether/services/ether.service";
import { TokenRespository } from "../repositories/token.repository";
import config from "src/config";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractService } from "./contract.service";
import { WalletRepository } from "src/wallet/wallet.repository";
import { OrganizationRepository } from "src/organizations/repositories/organization.repository";
import { ETokenStatus } from "../enums/token-status.enum";
import { GetAggregatedTokenDTO } from "../dto/get-aggregated-token.dto";
const fs = require("fs/promises");
const crypto = require('crypto');

@Injectable() 
export class TokenService {
    constructor(
        private readonly etherService: EtherService,
        private readonly tokenRepository: TokenRespository,
        private readonly userService: UserService,
        private readonly contractRepository: ContractRepository,
        private readonly contractService: ContractService,
        private readonly walletRepository: WalletRepository,
        private readonly organizationRepo: OrganizationRepository
    ){} 

    public async create(userId:string) {
        const templateAbsolutePath = config.contract.templateDir; 
        const contractBuffer:Buffer = await fs.readFile(templateAbsolutePath);
        const contractContent = contractBuffer.toString('utf8')
        const contractHash = this.hashContract(contractContent);
        // Store File on AWS s3 if contract version doesn't exist in database
        const contract = await this.contractRepository.findByContractHash(contractHash);
        if (!contract) await this.contractService.create(contractHash, contractBuffer);

        const [ user ]:IUserModel[] = await this.userService.findById(userId);
        const token = await this.tokenRepository.create(user.organizationId, contractHash).catch(e => {
            if (e.code === 11000) throw new BadRequestException("Token Already Exists"); return null;
        });
        if (!token) throw new InternalServerErrorException("Failed to Token Record");
        
        const { privateKey } = await this.walletRepository.findByUserId(userId);
        const transfer = await this.etherService.transferCryptoFromClient(privateKey).catch(_ => null);

        if (!transfer) throw new InternalServerErrorException();
        const { name, symbol } : IOrganization = await this.organizationRepo.findOrganizationById(user.organizationId);

        const injectedVariables = [
            {slot:'__name__', slotValue: name},
            {slot:'__symbol__', slotValue: symbol}
        ]

        const { absolutePath, outputFileName } = await this.etherService.generateDynamicContract(name, injectedVariables);

        const { interface:contractInterface, bytecode} = await this.etherService.compileSmartContractWithSolidity(absolutePath, outputFileName);
        const { contractAddress, gasUsed:_gasUsed } = await this.etherService.deploySmartContract(contractInterface, bytecode);
        // Need to Refund Unused Gas
        await this.contractService.deleteTempContract(absolutePath);

        await this.tokenRepository.updateByOrganizationId(user.organizationId, { 
            address: contractAddress, status:  ETokenStatus.DEPLOYED, injectedVariables, 
        });

        return true; 
    }
    
    public async getAggregatedToken({ organizationId } : GetAggregatedTokenDTO) {
        const [ token ] = await this.tokenRepository.getAggregatedToken(organizationId);
        return token; 
    }

    private hashContract(content:string) : string {
        return crypto.createHash('sha256').update(content).digest('hex');
    }
}