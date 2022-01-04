import * as mongoose from "mongoose";

export const contructUserAggregationPipeline = (_id:string) => {
    return [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(_id),
            },
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
        }
    ]
};