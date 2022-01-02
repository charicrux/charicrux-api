export {};

require("dotenv").config();

const config = {
    mongodb: {
        uri: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    jwt: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpire: (60 * 60 * 24) * 30,
    },
    port: process.env.PORT || 3001,
    origin: {
        whitelist: [
            "http://localhost",
        ]
    },
    etherNetwork: process.env.ROPSTEN_NETWORK_URL
}

module.exports = config; 