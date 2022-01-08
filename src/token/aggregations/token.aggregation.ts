import * as mongoose from "mongoose";
import { ETokenStatus } from "../enums/token-status.enum";

export const getAggregatedToken = (organizationId:string) => ([
    {
        $match: {
            organizationId: new mongoose.Types.ObjectId(organizationId),
            status: ETokenStatus.DEPLOYED
        }
    },
    {
        $lookup: {
            from: "organizations",
            localField: "organizationId",
            foreignField: "_id",
            as: "organization",
        }
    },
    {
        $unwind: { path: "$organization", preserveNullAndEmptyArrays: true }
    },
    {
        $addFields: {
            name: "$organization.name",
            symbol: "$organization.symbol",
        }
    },
    {
        $project: {
            organization: 0,
        }
    }
])