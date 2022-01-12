import { ES3Buckets } from "src/aws/enums/s3Buckets.enum";
import { ETokenNetwork } from "src/token/enums/token-network.enum";
import { networks } from "../static/networks";

export {};

require("dotenv").config();

const ETHEREUM_NETWORK = ETokenNetwork.ROBSTEN;

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
    crypto: {
        key: '88fdbd2f16674f088fd30c99c7c687aab0a0c318af12845bdd9b227a9a3eca84',
    },
    aws: {
        s3: {
            region: process.env.AWS_DEFAULT_REGION,
            apiVersion: "2006-03-01",
            buckets: {
                [ ES3Buckets.TOKEN_TEMPLATES ]: "charicrux-token-templates-dev",
            }
        },
        default: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
        }
    },
    port: 3001,
    etherNetwork: ETHEREUM_NETWORK,
    etherNetworkURL: networks[ETHEREUM_NETWORK],
}

module.exports = config; 