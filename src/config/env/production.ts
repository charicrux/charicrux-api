import { ES3Buckets } from "src/aws/enums/s3Buckets.enum";
import { ETokenNetwork } from "src/token/enums/token-network.enum";
import { networks } from "../static/networks";

export {};

require("dotenv").config();

const ETHEREUM_NETWORK = ETokenNetwork.ROBSTEN;

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
    crypto: {
        key: process.env.CRYPTO_KEY,
    },
    aws: {
        s3: {
            region: process.env.AWS_DEFAULT_REGION,
            apiVersion: "2006-03-01",
            buckets: {
                [ ES3Buckets.TOKEN_TEMPLATES ]: "charicrux-token-templates-prod",
            },
        },
        default: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
        }
    },
    port: process.env.PORT || 3001,
    origin: {
        whitelist: [
            "http://localhost",
        ]
    },
    etherNetwork: ETHEREUM_NETWORK,
    etherNetworkURL: networks[ETHEREUM_NETWORK],
}

module.exports = config; 