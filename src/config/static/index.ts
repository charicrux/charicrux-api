require("dotenv").config();

const staticConfig = {
    etherNetworks: {
        ropsten: process.env.ROPSTEN_NETWORK_URL
    },
    cryptoRootWallet: {
        mnemonic: process.env.METAMASK_WALLET_MNEMONIC,
        privateKey: process.env.METAMASK_WALLET_PRIVATE_KEY
    }
};

module.exports = staticConfig;