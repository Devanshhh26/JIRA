const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Project Manager', 'Developer', 'Viewer'], default: 'Viewer' },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    notifications: [{ 
        type: { type: String }, 
        message: String, 
        read: { type: Boolean, default: false }, 
        createdAt: { type: Date, default: Date.now } 
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
