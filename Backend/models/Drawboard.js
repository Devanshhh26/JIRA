const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DrawboardSchema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    data: { type: String },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drawboard', DrawboardSchema);
