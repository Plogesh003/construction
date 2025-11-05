require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/auth');
const rentalOrderRoutes = require('./routes/rentalOrders');
const siteRoutes = require('./routes/sites');
const scaffoldRentalRoutes = require('./routes/scaffoldRentals');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rental-orders', rentalOrderRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/scaffold-rentals', scaffoldRentalRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('ERP Construction Backend Running - Rental + Site + Scaffold Management');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});