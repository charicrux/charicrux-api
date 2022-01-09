import * as mongoose from "mongoose";

export const getAggregatedToken = (organizationId:string) => ([
    {
        $match: {
            organizationId: new mongoose.Types.ObjectId(organizationId),
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