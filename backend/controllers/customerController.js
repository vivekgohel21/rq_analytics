const connectDB = require('../database/db');

exports.getNewCustomers = async (req, res) => {
    try {
        const db = await connectDB();

        // Aggregation pipeline to group customers by day
        const pipeline = [
            {
                // Convert created_at to a Date object
                $addFields: {
                    created_at: { $toDate: "$created_at" }
                }
            },
            {
                // Sort by created_at in ascending order
                $sort: { created_at: 1 }
            }
        ];

        // Perform aggregation
        const dailyData = await db.collection('shopifyCustomers').aggregate(pipeline).toArray();

        // Calculate cumulative total
        let cumulativeTotal = 0;
        const result = dailyData.map((entry) => {
            cumulativeTotal += 1; // Each document represents a new customer
            return {
                date: entry.created_at.toISOString().split('T')[0], // Extract date part from created_at
                cumulativeTotal
            };
        });

        // Send the results as JSON response
        res.status(200).json(result);
    } catch (err) {
        // Handle errors and send an appropriate response
        res.status(500).json({ message: err.message });
    }
};
