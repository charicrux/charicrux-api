import { ETokenStatus } from "src/token/enums/token-status.enum";

export const getOrganizationAggregation = ($match) => ([
    {
        $match,
    },
    {
        $lookup: {
            from: "tokens",
            localField: "_id",
            foreignField: "organizationId",
            as: "token",
        }
    },
    {
        $unwind: { path: "$token", preserveNullAndEmptyArrays: true }
    },
    {
        $addFields: {
            tokenStatus: "$token.status" 
        }
    },
    {
        $match: {
            tokenStatus: ETokenStatus.DEPLOYED,
        }
    },
    {
        $project: {
            tokenStatus: 0,
            token: 0,
        }
    }
]);