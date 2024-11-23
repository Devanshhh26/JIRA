const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true }, // The task this comment is associated with
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The user who created the comment
    message: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // For nested comments
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('Comment', CommentSchema);
