// controllers/adminStatsController.js

const User = require('../models/User');
const School = require('../models/School');
const Application = require('../models/Application');

// Get User Statistics
exports.getUserStats = async (req, res) => {
    try {
        const userStats = {
            total: await User.countDocuments(),
            roleDistribution: await User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                }
            ]),
            recentUsers: await User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('-password'),
            userGrowth: await User.aggregate([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        };

        res.status(200).json({ success: true, data: userStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching user statistics', error: error.message });
    }
};

// Get School Statistics
exports.getSchoolStats = async (req, res) => {
    try {
        const schoolStats = {
            total: await School.countDocuments(),
            typeDistribution: await School.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 }
                    }
                }
            ]),
            categoryDistribution: await School.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]),
            regionDistribution: await School.aggregate([
                {
                    $group: {
                        _id: '$location.region',
                        count: { $sum: 1 }
                    }
                }
            ]),
            subscriptionTiers: await School.aggregate([
                {
                    $group: {
                        _id: '$metadata.subscriptionTier',
                        count: { $sum: 1 }
                    }
                }
            ])
        };

        res.status(200).json({ success: true, data: schoolStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching school statistics', error: error.message });
    }
};

// Get Application Statistics
exports.getApplicationStats = async (req, res) => {
    try {
        const applicationStats = {
            total: await Application.countDocuments(),
            statusDistribution: await Application.aggregate([
                {
                    $group: {
                        _id: '$applicationStatus',
                        count: { $sum: 1 }
                    }
                }
            ]),
            monthlyApplications: await Application.aggregate([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' },
                            status: '$applicationStatus'
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            paymentStats: await Application.aggregate([
                {
                    $group: {
                        _id: '$payment.status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$payment.amount' }
                    }
                }
            ]),
            paymentMethods: await Application.aggregate([
                {
                    $group: {
                        _id: '$payment.paymentMethod',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$payment.amount' }
                    }
                }
            ])
        };

        res.status(200).json({ success: true, data: applicationStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching application statistics', error: error.message });
    }
};

// Get Combined Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const [userStats, schoolStats, applicationStats] = await Promise.all([
            User.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        roleDistribution: [
                            { $group: { _id: '$role', count: { $sum: 1 } } }
                        ],
                        recentUsers: [
                            { $sort: { createdAt: -1 } },
                            { $limit: 5 },
                            { $project: { password: 0 } }
                        ]
                    }
                }
            ]),
            School.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        typeDistribution: [
                            { $group: { _id: '$type', count: { $sum: 1 } } }
                        ],
                        categoryDistribution: [
                            { $group: { _id: '$category', count: { $sum: 1 } } }
                        ]
                    }
                }
            ]),
            Application.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        statusDistribution: [
                            { $group: { _id: '$applicationStatus', count: { $sum: 1 } } }
                        ],
                        paymentStats: [
                            {
                                $group: {
                                    _id: '$payment.status',
                                    count: { $sum: 1 },
                                    totalAmount: { $sum: '$payment.amount' }
                                }
                            }
                        ]
                    }
                }
            ])
        ]);

        const dashboardStats = {
            userStats: {
                total: userStats[0].total[0]?.count || 0,
                roleDistribution: userStats[0].roleDistribution,
                recentUsers: userStats[0].recentUsers
            },
            schoolStats: {
                total: schoolStats[0].total[0]?.count || 0,
                typeDistribution: schoolStats[0].typeDistribution,
                categoryDistribution: schoolStats[0].categoryDistribution
            },
            applicationStats: {
                total: applicationStats[0].total[0]?.count || 0,
                statusDistribution: applicationStats[0].statusDistribution,
                paymentStats: applicationStats[0].paymentStats
            }
        };

        res.status(200).json({ success: true, data: dashboardStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard statistics', error: error.message });
    }
};