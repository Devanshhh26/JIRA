const AuditLog = require('../models/AuditLog');

const createAuditLog = async (action, details, performedBy) => {
    try {
        const newLog = new AuditLog({
            action,
            details,
            performedBy,
        });

        await newLog.save();

        console.log('Audit log created successfully:', newLog);
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};

const getAuditLogs = async (req, res) => {
    try {
        const { userId, action, startDate, endDate } = req.query;

        const filters = {};

        if (userId) filters.performedBy = userId;
        if (action) filters.action = new RegExp(action, 'i');
        if (startDate) filters.timestamp = { $gte: new Date(startDate) };
        if (endDate) {
            filters.timestamp = filters.timestamp || {};
            filters.timestamp.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(filters)
            .populate('performedBy', 'name email') 
            .sort({ timestamp: -1 });

        return res.status(200).json({
            success: true,
            logs,
        });
    } catch (error) {
        console.error('Error retrieving audit logs:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


const clearAuditLogs = async (req, res) => {
    try {
        const { cutoffDate } = req.body;

        const filters = {};
        if (cutoffDate) {
            filters.timestamp = { $lte: new Date(cutoffDate) };
        }

        const result = await AuditLog.deleteMany(filters);

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} audit logs deleted successfully.`,
        });
    } catch (error) {
        console.error('Error clearing audit logs:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

module.exports={createAuditLog,getAuditLogs,clearAuditLogs};