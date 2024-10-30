const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure that each email is unique
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'], // Restrict to student or admin roles
        required: true
    }
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
