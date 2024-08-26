const connectDB = require('../database/db');

exports.getGeographicalDistribution = async (req, res) => {
    try {
        const db = await connectDB();
        const distribution = await db.collection('shopifyCustomers').aggregate([
            { $group: { _id: "$default_address.city", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();
        res.json(distribution);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
