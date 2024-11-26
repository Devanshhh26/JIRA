const express = require('express');
const { getAuditLogs, clearAuditLogs } = require('../controllers/AuditLog');
const {authenticate} = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getAuditLogs); 
router.delete('/', authenticate, clearAuditLogs);

module.exports = router;
