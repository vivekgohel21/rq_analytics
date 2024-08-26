const connectDB = require('../database/db');

exports.getMonthlySalesData = async (req, res) => {
    try {
        const db = await connectDB();

        // Aggregation pipeline for monthly sales
        const pipeline = [
            {
                $addFields: {
                    created_at: { $dateFromString: { dateString: "$created_at" } },
                    total_price_set: {
                        shop_money: {
                            amount: { $toDouble: "$total_price_set.shop_money.amount" }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" }
                    },
                    totalSales: { $sum: "$total_price_set.shop_money.amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ];

        // Perform aggregation
        const salesData = await db.collection('shopifyOrders').aggregate(pipeline).toArray();

        // Calculate growth rate
        const result = salesData.map(entry => ({
            date: new Date(entry._id.year, entry._id.month - 1, 1).toISOString().split('T')[0], // Format as YYYY-MM-01
            totalSales: entry.totalSales
        }));

        // Calculate growth rates
        const growthRates = result.map((entry, index) => {
            if (index === 0) return { ...entry, growthRate: null }; // No growth rate for the first entry
            const previousEntry = result[index - 1];
            const growthRate = ((entry.totalSales - previousEntry.totalSales) / previousEntry.totalSales) * 100;
            return { ...entry, growthRate: parseFloat(growthRate.toFixed(2)) }; // Format to 2 decimal places
        });

        res.status(200).json(growthRates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
