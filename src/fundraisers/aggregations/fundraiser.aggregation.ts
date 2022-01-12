export const getFundraiserAggregation = ($match) => ([
    {
        $match,
    },
    {
        $lookup: {
            from:"organizations",
            localField: "organizationId",
            foreignField: "_id",
            as: "organization",
        }
    },
    {
        $unwind: {
            path: "$organization",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $limit: 15,
    }
])