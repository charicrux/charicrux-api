import { ETokenNetwork } from "src/token/enums/token-network.enum";
require('dotenv').config();

export const networks = {
    [ ETokenNetwork.ROBSTEN ] : process.env.ROPSTEN_NETWORK_URL,
    [ ETokenNetwork.MAINNET ]: process.env.MAINNET_NETWORK_URL,
    [ ETokenNetwork.RINKEBY ] : process.env.RINKEBY_NETWORK_URL,
    [ ETokenNetwork.KOVAN ]: process.env.KOVAN_NETWORK_URL,
}