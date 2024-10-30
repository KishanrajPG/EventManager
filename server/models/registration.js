const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    registration_id: {
        type: Number,
        required: true,
        unique: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    candidateEmails: {
        type: [String],
        required: true,
        validate: [arrayOrStringValidator, 'Must be a string or an array of strings']
    },
    attendance: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0
    }
});

// Custom validator to allow string or array of strings
function arrayOrStringValidator(value) {
    return typeof value === 'string' || (Array.isArray(value) && value.every(v => typeof v === 'string'));
}

module.exports = mongoose.model('Registration', registrationSchema);
