const connectDB = require('../database/db');

exports.getSalesData = async (req, res) => {
    try {
        const db = await connectDB();

        // Aggregation pipelines for different intervals
        const pipelines = {
            daily: [
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
                            month: { $month: "$created_at" },
                            day: { $dayOfMonth: "$created_at" }
                        },
                        totalSales: { $sum: "$total_price_set.shop_money.amount" }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                }
            ],
            monthly: [
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
            ],
            quarterly: [
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
                    $addFields: {
                        quarter: {
                            $switch: {
                                branches: [
                                    { case: { $lte: [{ $month: "$created_at" }, 3] }, then: 1 },
                                    { case: { $lte: [{ $month: "$created_at" }, 6] }, then: 2 },
                                    { case: { $lte: [{ $month: "$created_at" }, 9] }, then: 3 },
                                    { case: { $lte: [{ $month: "$created_at" }, 12] }, then: 4 }
                                ],
                                default: 1
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$created_at" },
                            quarter: "$quarter"
                        },
                        totalSales: { $sum: "$total_price_set.shop_money.amount" }
                    }
                },
                {
                    $addFields: {
                        date: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$_id.quarter", 1] }, then: { $dateFromParts: { year: "$_id.year", month: 3, day: 31 } } },
                                    { case: { $eq: ["$_id.quarter", 2] }, then: { $dateFromParts: { year: "$_id.year", month: 6, day: 30 } } },
                                    { case: { $eq: ["$_id.quarter", 3] }, then: { $dateFromParts: { year: "$_id.year", month: 9, day: 30 } } },
                                    { case: { $eq: ["$_id.quarter", 4] }, then: { $dateFromParts: { year: "$_id.year", month: 12, day: 31 } } }
                                ],
                                default: { $dateFromParts: { year: "$_id.year", month: 12, day: 31 } }
                            }
                        }
                    }
                },
                {
                    $sort: { "date": 1 }
                }
            ],
            yearly: [
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
                        _id: { year: { $year: "$created_at" } },
                        totalSales: { $sum: "$total_price_set.shop_money.amount" }
                    }
                },
                {
                    $sort: { "_id.year": 1 }
                }
            ]
        };

        // Get the interval from the query parameter
        const interval = req.query.interval || 'daily'; // Default to 'daily'

        if (!pipelines[interval]) {
            return res.status(400).json({ message: 'Invalid interval' });
        }

        // Perform aggregation
        const salesData = await db.collection('shopifyOrders').aggregate(pipelines[interval]).toArray();

        // Format the data for response
        const result = salesData.map(entry => ({
            date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : new Date(entry._id.year, entry._id.month ? entry._id.month - 1 : 0, entry._id.day || 1).toISOString().split('T')[0],
            totalSales: entry.totalSales
        }));

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
