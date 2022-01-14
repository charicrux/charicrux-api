import * as mongoose from "mongoose";

export const getAggregatedToken = ($match) => ([
    {
        $match,
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
            description: "$organization.description",
        }
    },
    {
        $project: {
            organization: 0,
        }
    }
])