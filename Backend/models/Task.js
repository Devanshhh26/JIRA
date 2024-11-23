const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['To-do', 'In-progress', 'Done', 'Blocked'], default: 'To-do' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    dueDate: { type: Date },
    subtasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    comments: [{ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        message: String, 
        createdAt: { type: Date, default: Date.now } 
    }],
    tags: [String],
    attachments: [String],
    activityLog: [{ 
        action: String, 
        performedBy: { type: Schema.Types.ObjectId, ref: 'User' }, 
        timestamp: { type: Date, default: Date.now } 
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
