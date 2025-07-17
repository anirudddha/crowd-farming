const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const campaignRoutes = require('./routes/campaignRoutes');
const authRoutes = require('./routes/auth');

const userCampaign = require('./routes/userRoutes');
const { itemRouter } = require('./routes/itemRoutes');
const { cartRouter } = require('./routes/cartRoutes');
const { orderRouter } = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // <-- IMPORT NEW ROUTES

// const userCampaign = require('./routes/userRoutes')
const bodyParser = require('body-parser');


const app = express();
require('dotenv').config();


// Increase body-parser limits for JSON and URL-encoded data
app.use(bodyParser.json({ limit: '50mb' })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Alternatively, if using the built-in express.json middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cors());
app.use(express.json()); // For parsing application/json

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

// Use routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/auth', authRoutes);
app.use('/api',userCampaign);
app.use('/api/items',itemRouter);
app.use('/api/cart',cartRouter);
app.use('/api/orders',orderRouter);

app.use('/api/payments', paymentRoutes); // <-- USE NEW PAYMENT ROUTES




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
