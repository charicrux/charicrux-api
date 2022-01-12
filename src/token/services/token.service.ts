import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IOrganization } from "src/organizations/interfaces/organization.interface";
import { IUserModel } from "src/user/interfaces/user.interface";
import { UserService } from "src/user/user.service";
import { EtherService } from "../../ether/services/ether.service";
import { TokenRespository } from "../repositories/token.repository";
import config from "src/config";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractService } from "./contract.service";
import { OrganizationRepository } from "src/organizations/repositories/organization.repository";
import { ETokenStatus } from "../enums/token-status.enum";
import { GetAggregatedTokenDTO } from "../dto/get-aggregated-token.dto";
import { WalletService } from "src/wallet/wallet.service";
import * as mongoose from "mongoose";
import { ITokenModel } from "../interfaces/token.interface";
import { S3Service } from "src/aws/services/s3.service";
import { add } from "nconf";
const path = require('path');
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
        private readonly walletService: WalletService,
        private readonly organizationRepo: OrganizationRepository,
        private readonly s3Service: S3Service,
    ){} 

    public async create(userId:string) {
        try {
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
            
            const privateKey = await this.walletService.getPrivateKey(new mongoose.Types.ObjectId(userId));

            const transfer = await this.etherService.transferCryptoFromClient(privateKey).catch(_ => null);

            if (!transfer) throw new InternalServerErrorException();
            const { name, symbol } : IOrganization = await this.organizationRepo.findOrganizationById(user.organizationId);

            const injectedVariables = [
                {slot:'__name__', slotValue: name},
                {slot:'__symbol__', slotValue: symbol}
            ]

            const { absolutePath, outputFileName } = await this.etherService.generateDynamicContract(name, injectedVariables);

            const source = await fs.readFile(absolutePath, "utf8");
            const { interface:contractInterface, bytecode} = await this.etherService.compileSmartContractWithSolidity(source, outputFileName);
            const { contractAddress, gasUsed:_gasUsed } = await this.etherService.deploySmartContract(contractInterface, bytecode);
            // Need to Refund Unused Gas
            await this.contractService.deleteTempContract(absolutePath);

           // await this.deployTokenWithUniswap({ ...token, address: contractAddress });

            await this.tokenRepository.updateByOrganizationId(user.organizationId, { 
                address: contractAddress, status:  ETokenStatus.DEPLOYED, injectedVariables, 
            });

            return true; 
        } catch (e:any) {
            console.log(e);
            const [ user ]:IUserModel[] = await this.userService.findById(userId);
            await this.tokenRepository.deleteByOrganizationId(user.organizationId);
            return new InternalServerErrorException("Failed to Create Token");
        } 
    }

    public async loadContract(contractHash:string, outputFolder, contractPath) {
        const { aws: { key, bucket }, _id} = await this.contractRepository.findByContractHash(contractHash);
        const response = await this.s3Service.getPrivateObjectBody({ key, bucket });
        const source = (response as Buffer).toString('utf-8');
        const outputfilename = _id;
        const { interface:contractInterface } = await this.etherService.compileSmartContractWithSolidity(source, outputfilename);
        const contractInterfaceSerialized = JSON.stringify(contractInterface, null, 2);
        await fs.mkdir(outputFolder, { recursive: true });
        await fs.writeFile(contractPath, contractInterfaceSerialized);
        return contractInterface;
    }

    public async getContractABI(contractHash) {
        const contractFolder = path.join(__dirname, "../temp");
        const contractPath = path.join(contractFolder, `${contractHash}.json`);
        const contract = await fs.readFile(contractPath, 'utf-8').catch(_ => null);

        if (contract) return JSON.parse(contract); 
        else return await this.loadContract(contractHash, contractFolder, contractPath);
    }

    public async deployTokenWithUniswap({ contractHash, address }:ITokenModel) {
        // Exchange Address 0xa36DCE1e70B113c3c1cc8CD9CEC95B8df014F0f0
        // const exchangeAddress = "0xa36DCE1e70B113c3c1cc8CD9CEC95B8df014F0f0"; 
        // const abi = await this.getContractABI(contractHash);
        // const tokenContract = await this.etherService.tokenContract(abi, address);


        // const clientAddress = "0x23E22c8B1f0a611f6EA3DEadea35Fa67eCe3ac6A";
        // const balance = await this.getTokenBalance(abi, address, clientAddress);
        // await this.etherService.approveTokens(abi, address, exchangeAddress, balance);
        
       // await this.etherService.addLiquidityInUniswapPool(exchangeAddress, balance)
       //const tokenReserve = abi.methods.balanceOf("0x68A392a28d85C288A41e188f8dC119f5E122b6Db");

        // const exchangeAddress = await this.etherService.deployExchangeWithUniswapProtocol(address);
        // if (!exchangeAddress) throw new InternalServerErrorException("Failed to Deploy Exchange");
        // console.log(exchangeAddress);

        //return exchangeAddress; 
    }

    public async getAggregatedToken({ organizationId } : GetAggregatedTokenDTO) {
        const [ token ] = await this.tokenRepository.getAggregatedToken(organizationId);
        return token; 
    }

    public async getTokenBalance(abi, contractAddress, clientAddress) {
        return await this.etherService.getTokenBalanceByAddress(abi, contractAddress, clientAddress);
    }

    private hashContract(content:string) : string {
        return crypto.createHash('sha256').update(content).digest('hex');
    }
}