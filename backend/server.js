const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database/db');

// controllers
const SalesController = require('./controllers/salesController');
const SalesGrowthController = require('./controllers/salesGrowthController');
// const RepeatCustomerController = require('./controllers/repeateCustomerController');
const LifetimeValueController = require('./controllers/lifetimeValueController');
const GeographicalController = require('./controllers/geographicalController');
const CustomerController = require('./controllers/customerController');

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


connectDB();

// routes
app.get('/total-sales', SalesController.getSalesData);

app.get('/sales-growth', SalesGrowthController.getMonthlySalesData);
// app.get('/repeat-customers', RepeatCustomerController.getRepeatCustomers);
app.get('/cohort-lifetime-value', LifetimeValueController.getCustomerLifetimeValueByCohorts);
app.get('/geographical-distribution', GeographicalController.getGeographicalDistribution);
app.get('/new-customers', CustomerController.getNewCustomers);

// server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Server is running');
});
