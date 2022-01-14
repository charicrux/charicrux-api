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
// import memfs from "memfs";
// import EthTx from "ethereumjs-tx";
const moment = require("moment");
const NonceSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");

@Injectable()
export class EtherService {
    private readonly masterProvider:typeof HDWalletProvider; 
    private readonly web3:typeof Web3

    constructor() {
        this.masterProvider = new HDWalletProvider( config.cryptoRootWallet.mnemonic, config.etherNetworkURL );
        this.masterProvider.engine.addProvider(new NonceSubprovider());
        this.web3 = new Web3(this.masterProvider);
    }

    public async getPairAddress(tokenAddress) {
        const [ clientAccount ] = await this.web3.eth.getAccounts();
        const factoryContract = await this.uniswapV2FactoryContract();
        const wethAddress = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
        const response = await factoryContract.methods.getPair(wethAddress, tokenAddress).call({ from: clientAccount });
        return response;
    }

    /**
     * 
     * @param address ERC20 Token Contract Address
     */

    public async uniswapDeployWithRouterV2(tokenABI, address) {
        try {
            const ethereumAmount = Web3.utils.toWei('0.0005', 'ether');
            const [ clientAccount ] = await this.web3.eth.getAccounts();
            const routerContract = await this.uniswapV2RouterContract();
            const tokenContract = this.getContractFromABI(tokenABI, address);       
            const balance = await this.getTokenBalanceByAddress(tokenABI, address, clientAccount);
            const allowed = await tokenContract.methods.approve("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", balance).send({ from: clientAccount, gas: 100000 })
            if (!allowed.status) return; 
    
            const deadline = moment().add(1, 'h').unix();
            const toAddress = clientAccount
            const response = await routerContract.methods.addLiquidityETH(
                address, balance, balance, ethereumAmount, toAddress, deadline
            ).send({
                from: clientAccount, gas: 3000000, value: ethereumAmount
            });
            if (!response) new InternalServerErrorException("Failed to Deploy Token Using Uniswap Protocol");
            return this.getPairAddress(address);
        } catch (e) { console.log(e) }
    }

    public async buyTokensForFixedEther(userPrivateKey, userAddress, tokenAddress, ether) {
        const address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Robsten Uniswap Router Address
        const routerABIPath = path.join(__dirname, "../json/UniswapV2Router02ABI.json");
        const abi = JSON.parse(await fs.readFile(routerABIPath, 'utf-8'))
        const provider = new HDWalletProvider(
            userPrivateKey,
            config.etherNetworkURL
        );
        const web3 = new Web3(provider);
        const [ clientAccount ] = await web3.eth.getAccounts();
        const routerContract = new web3.eth.Contract(abi, address);
        const toAddress = userAddress// user recieving crypto
        const tokenPurchaseAmount = Web3.utils.toWei(ether.toString(), 'ether');
        const deadline = moment().add(1, 'h').unix();
        const minTokens = 1; 
        const response = await routerContract.methods.swapExactETHForTokens(minTokens, [
            '0xc778417E063141139Fce010982780140Aa0cD5Ab', // Weth Robsten Address
            tokenAddress
        ], toAddress, deadline).send({ from: clientAccount, gas: 300000, value: tokenPurchaseAmount   })
        return response; 
    };

    public async getTokenTradeValue(tokenAddress, ether) {
        if (!ether || ether <= 1e-7) return 0; 
        const [ clientAccount ] = await this.web3.eth.getAccounts();
        const address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Robsten Uniswap Router Address
        const routerABIPath = path.join(__dirname, "../json/UniswapV2Router02ABI.json");
        const abi = JSON.parse(await fs.readFile(routerABIPath, 'utf-8'))
        const routerContract = new this.web3.eth.Contract(abi, address);
        const response = await routerContract.methods.getAmountsOut(
            Web3.utils.toWei(ether.toString(), 'ether'), [ 
                "0xc778417E063141139Fce010982780140Aa0cD5Ab", // weth address
                tokenAddress,
            ]
        ).call({ from: clientAccount });
        const [ _, tokens ] = response;
        const tokensAmount = Web3.utils.fromWei(tokens, 'ether');
        return tokensAmount; 
    }

    public async uniswapV2FactoryContract(){
        const address = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; // Robsten Address
        const factoryABIPath = path.join(__dirname, "../json/UniswapV2FactoryABI.json");
        const factoryContract = await this.getContract(address, factoryABIPath);
        return factoryContract; 
    }

    public async uniswapV2RouterContract(){
        const address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Robsten Address
        const routerABIPath = path.join(__dirname, "../json/UniswapV2Router02ABI.json");
        const routerContract = await this.getContract(address, routerABIPath);
        return routerContract; 
    }

    public async uniswapExchangeContract(exchangeAddress:string){
        const exchangeABIPath = path.join(__dirname, "../json/UniswapExchangeABI.json");
        const exchangeContract = await this.getContract(exchangeAddress, exchangeABIPath);
        return exchangeContract; 
    }

    public getContractFromABI(abi, address) {
        return new this.web3.eth.Contract(abi, address);
    }

    public async getContract(address:string, contractPath:string) {
        const abi = JSON.parse(await fs.readFile(contractPath, 'utf-8'))
        const contract = this.getContractFromABI(abi, address);
        return contract;
    }

    public async uniswapFactoryContract(){
        const factoryAddress = "0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351";
        const factoryABIPath = path.join(__dirname, "../json/UniswapFactoryABI.json");
        const factoryContract = await this.getContract(factoryAddress, factoryABIPath);
        return factoryContract; 
    }

    public async getExchangeAddressByToken(token:string) {      
        const factoryContract = await this.uniswapFactoryContract();
        const exchangeAddress = await factoryContract.methods.getExchange(token).call();
        return exchangeAddress; 
    }

    /** Deploys Uniswap Exchange for Token
     * 
     * @param tokenAddress contract address of deployed token
     * @returns exchange address of token that handles swaps
     */

    public async deployExchangeWithUniswapProtocol(tokenAddress:string) {
        const factoryContract = await this.uniswapFactoryContract();
        const [ clientAccount ] = await this.web3.eth.getAccounts();
        const transaction = await factoryContract.methods.createExchange(tokenAddress).send({ from: clientAccount }).catch(e => {
            console.log(e);
            return null;
        });
        if (!transaction) return new InternalServerErrorException("Failed to Create New Exchange");
        const exchangeAddress = await factoryContract.methods.getExchange(tokenAddress).call();
        return exchangeAddress; 
    }

    /** 
     *    @param privateKey user private key
     */  

    public async getWalletBalance(privateKey) {
        const customHttpProvider = new ethers.providers.JsonRpcProvider(config.etherNetworkURL);
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

    public async compileSmartContractWithSolidity(source:any, _outputFileName:string) : Promise<{ interface:any, bytecode:any }> {
        const identifer = "OrganizationToken";
        
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
    
    public async getTokenBalanceByAddress(contractABI, contractAddress, clientAddress) {
        const [ clientAccount ] = await this.web3.eth.getAccounts();
        const tokenContract = new this.web3.eth.Contract(contractABI, contractAddress);
        const tokenBalance = await tokenContract.methods.balanceOf(clientAddress).call({ from: clientAccount });
        return tokenBalance; 
    }

    public async tokenContract(contractABI, contractAddress) {
        const tokenContract = new this.web3.eth.Contract(contractABI, contractAddress);
        return tokenContract;
    }

    public async approveTokens(contractABI, contractAddress, exchangeAddress, balance) {
        const [ clientAccount ] = await this.web3.eth.getAccounts();
        const tokenContract = new this.web3.eth.Contract(contractABI, contractAddress);
        const approve = await tokenContract.methods.approve(exchangeAddress, balance).call({ from: clientAccount });
        console.log(approve);
    }

    public async getGasPrice() {
        const response = await this.web3.eth.getGasPrice();
        const gasPrice = Number(response); // WEI
        return gasPrice; 
    }
    
    public estimateGasCost(gasUnits:number, gasPrice:number) {
        const gasCostWEI = gasUnits * gasPrice // WEI Gas Cost
        const gasCostETH = Web3.utils.fromWei(Web3.utils.toBN(gasCostWEI), 'ether');
        return gasCostETH;
    }  

    /**
     * 
     * @param maxGasUnits 
     * @returns gasCostETH represents minimum cost and maxGasCostETH represents max cost
     */

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
            config.etherNetworkURL
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

        const [ currentAccount ] = await this.web3.eth.getAccounts();

        const totalSupply = Web3.utils.toWei('100000', 'ether'); 

        const contractDeployInfo = await new this.web3.eth
            .Contract(contractInterface)
            .deploy({
                 data: "0x" + bytecode,
                 arguments: [ totalSupply ]
            } as any)
           
        contractDeployInfo.encodeABI();
        const gas = await contractDeployInfo.estimateGas();
        console.log(gas);
        const nonce = await this.web3.eth.getTransactionCount(currentAccount, 'pending');
        console.log(nonce);
        const receipt:any = await new Promise((resolve, reject) => {
            contractDeployInfo.send({ gas: "1000000", from: currentAccount }).on('receipt', (receipt) => {
                console.log(receipt);
                resolve(receipt)
            }).on('error', (e) => {
                console.log(e, receipt);
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
        const customHttpProvider = new ethers.providers.JsonRpcProvider(config.etherNetworkURL);
        const privateKey = this.generatePrivateKey();
        const { address } = new ethers.Wallet(privateKey, customHttpProvider);
        return { address, privateKey };
    }

    private generateAddressFromPrivateKey(privateKey) {
        const customHttpProvider = new ethers.providers.JsonRpcProvider(config.etherNetworkURL);
        return new ethers.Wallet(privateKey, customHttpProvider);
    }

    private generatePrivateKey() : string {
        const id = crypto.randomBytes(32).toString('hex');
        const privateKey = `0x${id}`;
        return privateKey; 
    }
}