// models/event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['individual', 'team'], required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    is_locked: { type: Boolean, default: false }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
