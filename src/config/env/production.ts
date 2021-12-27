export {};

require("dotenv").config();

const config = {
    port: process.env.PORT || 3001,
    etherNetwork: process.env.ROPSTEN_NETWORK_URL
}

module.exports = config; 