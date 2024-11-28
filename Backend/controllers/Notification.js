const Notification = require('../models/Notification');

const createNotification = async (req, res) => {
    try {
        const { user, type, message } = req.body;

        if (!user || !message) {
            return res.status(400).json({ success: false, message: "User and message are required." });
        }

        const newNotification = new Notification({
            user,
            type,
            message,
        });

        await newNotification.save();

        return res.status(201).json({
            success: true,
            message: "Notification created successfully.",
            notification: newNotification,
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { unreadOnly } = req.query;

        const filter = { user: userId };
        if (unreadOnly === 'true') {
            filter.read = false;
        }

        const notifications = await Notification.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found." });
        }

        notification.read = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user._id; 

        await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ user: userId });

        return res.status(200).json({
            success: true,
            message: "All notifications deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports={createNotification, getNotifications,markAllNotificationsAsRead,markNotificationAsRead,deleteAllNotifications,deleteNotification};