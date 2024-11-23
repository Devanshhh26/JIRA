const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    auditLogs: [{ 
        action: String, 
        details: String, 
        performedBy: { type: Schema.Types.ObjectId, ref: 'User' }, 
        timestamp: { type: Date, default: Date.now } 
    }]
});

module.exports = mongoose.model('Admin', AdminSchema);
