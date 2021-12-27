export {};

require("dotenv").config();

const config = {
    port: 3001,
    etherNetwork: process.env.ROPSTEN_NETWORK_URL
}

module.exports = config; 