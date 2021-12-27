import { Injectable } from "@nestjs/common";
import { generateTemplateFilesBatch, CaseConverterEnum } from "generate-template-files";
import config from "../../config/index";
import { promises as fs } from "fs";
const HDWalletProvider = require("truffle-hdwallet-provider")
const { exec } = require("child_process");
const path = require('path');
const crypto = require("crypto");
const ethers = require("ethers");
const Web3 = require("web3");
const solc = require("solc");

@Injectable()
export class EtherService {
    constructor() {}

    public async generateDynamicContract(name:string, symbol:string) : Promise<{ outputFileName:string, absolutePath:string }> {
        const identifier = name.replace(/\s/g, "");
        const outputFileName = `${identifier}Contract.sol`;
        const absolutePath = path.join(__dirname, `../contracts/${outputFileName}`)
        
        await generateTemplateFilesBatch([{
            option: "Dynamic Ethereum Contract",
            defaultCase: CaseConverterEnum.None,
            entry: {
                folderPath: path.join(__dirname, "../templates", "contract.sol"),
            },
            dynamicReplacers: [
                {slot:'__name__', slotValue: name},
                {slot:'__symbol__', slotValue: symbol}
            ],
            output: {
                path: absolutePath,
                pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
                overwrite: false,
            },
        }]);

        return { outputFileName, absolutePath };
    }

    public async compileSmartContractWithSolidity(absolutePath:string) : Promise<{ interface:any, bytecode:any }> {
        const identifer = "OrganizationToken";
        const source = await fs.readFile(absolutePath, "utf8");
        return solc.compile(source, 1).contracts[`:${identifer}`];

        // Once Contract is Compiled

        // 1. Need to Upload to S3 Bucket for Record
        // 2. Need to Delete Smart Contract 
    }

    public compileSmartContractWithHardhat() : Promise<boolean> {
        const cmd = ["npx", "hardhat", "compile"]; 
        return new Promise((resolve, _) => {
            exec(cmd.join(" "), { maxBuffer: 1024 * 500 }, (_error:boolean, stdout:boolean, _stderr:boolean) => {
              resolve(stdout ? true : false);
            });
        });
    }

    public async deploySmartContract(contractInterface, bytecode) {
        console.log("Deploying Contract...");
        // Before Deployment
        // 1. Need to Verify Token Doesn't Already Exist

        const provider = new HDWalletProvider(
            config.cryptoRootWallet.mnemonic,
            config.etherNetwork
          );

        const web3 = new Web3(provider);
        const [ currentAccount ] = await web3.eth.getAccounts();

        const result = await new web3.eth
            .Contract(JSON.parse(contractInterface))
            .deploy({ data: "0x" + bytecode})
            .send({ gas: "1000000", from: currentAccount });

        console.log("Contract deployed to", result.options.address); 
        
        // Once Contract is Deployed
        // 1. Need to Save Contract Address
        // 2. Need to Save Contract Version
    }

    public generateAddress() : { address:string, privateKey:string } {
        const privateKey = this.generatePrivateKey();
        const { address } = new ethers.Wallet(privateKey);
        return { address, privateKey };
    }

    private generatePrivateKey() : string {
        const id = crypto.randomBytes(32).toString('hex');
        const privateKey = `0x${id}`;
        return privateKey; 
    }
}