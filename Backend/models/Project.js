const ProjectSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    archived: { type: Boolean, default: false },
    activityLog: [{ 
        action: String, 
        performedBy: { type: Schema.Types.ObjectId, ref: 'User' }, 
        timestamp: { type: Date, default: Date.now } 
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
