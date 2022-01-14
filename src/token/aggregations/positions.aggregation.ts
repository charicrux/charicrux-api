import * as mongoose from "mongoose";

export const getPositionsAggregations = (userId) => ([
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId) ,
        }
    },
    {
        $lookup: {
            from: "tokens",
            localField: "tokenId",
            foreignField: "_id",
            as: "token",
        }
    },
    {
        $unwind: { path: "$token", preserveNullAndEmptyArrays: true }
    },
    {
        $lookup: {
            from: "organizations",
            localField: "token.organizationId",
            foreignField: "_id",
            as: "organization"
        }
    },
    {
        $unwind: { path: "$organization", preserveNullAndEmptyArrays: true }
    },
]);