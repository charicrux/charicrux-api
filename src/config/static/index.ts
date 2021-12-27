require("dotenv").config();

const staticConfig = {
    etherNetworks: {
        ropsten: process.env.ROPSTEN_NETWORK_URL
    },
    cryptoRootWallet: {
        mnemonic: process.env.METAMASK_WALLET_MNEMONIC
    }
};

module.exports = staticConfig;