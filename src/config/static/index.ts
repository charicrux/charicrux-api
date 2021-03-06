import { networks } from "./networks";

require("dotenv").config();
const path = require('path');

const staticConfig = {
    etherNetworks: networks,
    cryptoRootWallet: {
        mnemonic: process.env.METAMASK_WALLET_MNEMONIC,
        privateKey: process.env.METAMASK_WALLET_PRIVATE_KEY
    },
    contract: {
        templateDir: path.join(__dirname, "../../ether", "templates", "contract.sol")
    }
};

module.exports = staticConfig;