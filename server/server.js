const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('./models/user'); // Assuming you have a User model defined
const app = express();
const cors = require('cors'); // Import CORS

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json());

// Your secret key (should be stored securely in environment variables)
const JWT_SECRET = 'supersecretkey123456';

app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error code
            res.status(400).json({ message: 'Email is already registered.' });
        } else {
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await bcrypt.compare(password, user.password)) {
        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    
    if (!token) return res.sendStatus(401); // No token provided
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user; // Save user info to request
        next(); // Proceed to next middleware
    });
};

// Connect to MongoDB and start the server
mongoose.connect('mongodb+srv://Kishanrajpg:EventDB%402024@eventdb.kuq2x.mongodb.net/?retryWrites=true&w=majority&appName=EventDB')
    .then(() => app.listen(4000, () => console.log('Server running on port 4000')))
    .catch(err => console.log(err));
