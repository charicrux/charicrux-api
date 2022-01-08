import { Injectable, InternalServerErrorException } from "@nestjs/common";
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
import memfs from "memfs";

@Injectable()
export class EtherService {
    private readonly masterProvider:typeof HDWalletProvider; 

    constructor() {
        this.masterProvider = new HDWalletProvider( config.cryptoRootWallet.mnemonic, config.etherNetwork );
    }

    public async sendEther() {}

    public async getWalletBalance(privateKey) {
        const customHttpProvider = new ethers.providers.JsonRpcProvider(config.etherNetwork);
        const wallet = new ethers.Wallet(privateKey, customHttpProvider);
        const balance = await wallet.getBalance(); 
        const ether = Web3.utils.fromWei(balance.toString(), "ether" );
        return ether;
    };

    public async generateDynamicContract(name, dynamicReplacers:{ slot: string, slotValue:string }[]) : Promise<{ outputFileName:string, absolutePath:string }> {
        const identifier = name.replace(/\s/g, "");
        const outputFileName = `${identifier}Contract.sol`;
        const absolutePath = path.join(__dirname, `../temp/compiledContracts/${outputFileName}`)
        
        await generateTemplateFilesBatch([{
            option: "Dynamic Ethereum Contract",
            defaultCase: CaseConverterEnum.None,
            entry: {
                folderPath: path.join(__dirname, "../templates", "contract.sol"),
            },
            dynamicReplacers,
            output: {
                path: absolutePath,
                pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
                overwrite: false,
            },
        }]);

        return { outputFileName, absolutePath };
    }

    public async compileSmartContractWithSolidity(absolutePath:string, _outputFileName:string) : Promise<{ interface:any, bytecode:any }> {
        const identifer = "OrganizationToken";
        const source = await fs.readFile(absolutePath, "utf8");
        // return solc.compile(source, 1).contracts[`:${identifer}`];

        const input = {
            language: 'Solidity',
            sources: {
                [ _outputFileName ] : {
                    content: source
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': [ '*' ]
                    }
                }
            }
        }; 
  
        const { abi:contractInterface, evm } = JSON.parse(solc.compile(JSON.stringify(input))).contracts[_outputFileName][identifer];
        const bytecode = evm.bytecode.object
        return { interface: contractInterface, bytecode };
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

    public async getGasPrice() {
        const web3 = new Web3(this.masterProvider);
        const response = await web3.eth.getGasPrice();
        const gasPrice = Number(response); // WEI
        return gasPrice; 
    }
    
    public estimateGasCost(gasUnits:number, gasPrice:number) {
        const gasCostWEI = gasUnits * gasPrice // WEI Gas Cost
        const gasCostETH = Web3.utils.fromWei(Web3.utils.toBN(gasCostWEI), 'ether');
        return gasCostETH;
    }  

    public async estimateContractGasPrice(maxGasUnits:number) {
        const { size } = await fs.stat(config.contract.templateDir);
        const gasUnits = size * 200; 
        const gasPrice = await this.getGasPrice();
        const gasCostETH = this.estimateGasCost(gasUnits, gasPrice);
        const maxGasCostETH = this.estimateGasCost(maxGasUnits, gasPrice);
        return { gasCostETH, maxGasCostETH };
    }

    public async transferCryptoFromClient(privateKey) {
        const provider = new HDWalletProvider(
            privateKey,
            config.etherNetwork
        );

        const web3 = new Web3(provider);
        const [ clientAccount ] = await web3.eth.getAccounts();
        const masterPrivateKey = config.cryptoRootWallet.privateKey;
        const { address:masterAddress} = this.generateAddressFromPrivateKey(masterPrivateKey);
        
        const { maxGasCostETH } = await this.estimateContractGasPrice(1000000);
        const maxGasCostWEI = Web3.utils.toWei(maxGasCostETH, 'ether');

        const _transaction = await web3.eth.sendTransaction({
            to: masterAddress, from: clientAccount, value: maxGasCostWEI
        }).catch(e => {
            console.log("Error: ", e);
            throw new InternalServerErrorException("Failed to Create Token");
            // Need to Delete Token Existence from Database
        });
        
        // Need to Log Transactions for Pursueing Refunds
        // _transaction 

        return _transaction; 
    }

    public async deploySmartContract(contractInterface, bytecode) : Promise<{ gasUsed:number, contractAddress:string } | null> {
        // Before Deployment
        // 1. Need to Verify Token Doesn't Already Exist

        const web3 = new Web3(this.masterProvider);
        const [ currentAccount ] = await web3.eth.getAccounts();

        const contractDeployInfo = await new web3.eth
            .Contract(contractInterface)
            .deploy({
                 data: "0x" + bytecode,
                 arguments: [ Web3.utils.toWei('100000', 'ether') ]
            } as any)
           
        contractDeployInfo.encodeABI();
        const gas = await contractDeployInfo.estimateGas();
        const receipt:any = await new Promise((resolve, reject) => {
            contractDeployInfo.send({ gas: "1000000", from: currentAccount }).on('receipt', (receipt) => {
                resolve(receipt)
            }).on('error', (e) => {
                console.log(e);
                reject(null);
            });
        }).catch(_ => null);
        // receipt: store transactionHash

        return receipt ? { 
            contractAddress: receipt?.contractAddress, 
            gasUsed: gas // estimated
        } : null; 
    }

    public generateAddress() : { address:string, privateKey:string } {
        const customHttpProvider = new ethers.providers.JsonRpcProvider(config.etherNetwork);
        const privateKey = this.generatePrivateKey();
        const { address } = new ethers.Wallet(privateKey, customHttpProvider);
        return { address, privateKey };
    }

    private generateAddressFromPrivateKey(privateKey) {
        const customHttpProvider = new ethers.providers.JsonRpcProvider(config.etherNetwork);
        return new ethers.Wallet(privateKey, customHttpProvider);
    }

    private generatePrivateKey() : string {
        const id = crypto.randomBytes(32).toString('hex');
        const privateKey = `0x${id}`;
        return privateKey; 
    }
}