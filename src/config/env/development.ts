import { ES3Buckets } from "src/aws/enums/s3Buckets.enum";

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
    etherNetwork: process.env.ETHER_NETWORK_URL,
}

module.exports = config; 