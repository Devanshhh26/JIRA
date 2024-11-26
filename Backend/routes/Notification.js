const express = require('express');
const { 
    createNotification, 
    getNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification, 
    deleteAllNotifications 
} = require('../controllers/Notification');
const {authenticate} = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, createNotification);
router.get('/', authenticate, getNotifications);
router.patch('/:notificationId/read', authenticate, markNotificationAsRead);
router.patch('/read-all', authenticate, markAllNotificationsAsRead);
router.delete('/:notificationId', authenticate, deleteNotification);
router.delete('/all', authenticate, deleteAllNotifications);

module.exports = router;
