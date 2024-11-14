const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");
const dotenv = require('dotenv');
const path = require('path'); // Import path module
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the 'uploads' directory using an absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Test route to check server status
app.get("/", (req, res) => {
    return res.status(200).send(`Server running on port ${PORT}`);
});

// Start the server and connect to the database
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
});
