export {};

require("dotenv").config();

const config = {
    mongodb: {
        uri: "mongodb://localhost:27017/charicrux",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    jwt: {
        jwtSecret: 'jwtsecret2022',
        jwtExpire: (60 * 60 * 24) * 30,
    },
    port: 3001,
    etherNetwork: process.env.ETHER_NETWORK_URL
}

module.exports = config; 