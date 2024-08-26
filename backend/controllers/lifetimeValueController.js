const connectDB = require('../database/db');

exports.getCustomerLifetimeValueByCohorts = async (req, res) => {
    try {
        const db = await connectDB();

        // Aggregation pipeline to calculate CLTV by cohort
        const pipeline = [
            {
                $addFields: {
                    firstPurchaseMonth: {
                        $dateToString: { format: "%Y-%m", date: { $dateFromString: { dateString: "$customer.created_at" } } }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        firstPurchaseMonth: "$firstPurchaseMonth",
                        customerId: "$customer.id"
                    },
                    totalSpent: { $sum: { $toDouble: "$total_price" } },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.firstPurchaseMonth",
                    cohortTotalSpent: { $sum: "$totalSpent" },
                    cohortTotalOrders: { $sum: "$orderCount" },
                    cohortCustomerCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    firstPurchaseMonth: "$_id",
                    cohortTotalSpent: 1,
                    cohortTotalOrders: 1,
                    cohortCustomerCount: 1,
                    averageCustomerLifetimeValue: {
                        $divide: ["$cohortTotalSpent", "$cohortCustomerCount"]
                    }
                }
            },
            {
                $sort: { firstPurchaseMonth: 1 }
            }
        ];

        // Perform aggregation
        const cltvByCohorts = await db.collection('shopifyOrders').aggregate(pipeline).toArray();

        // Debugging: Log the result to check if it's as expected
        console.log('CLTV by Cohorts Data:', cltvByCohorts);

        // Send response
        res.status(200).json(cltvByCohorts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
