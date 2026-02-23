const mongoose = require('mongoose');
require('./order.model'); // import your schemas

// Connect to MongoDB (modern v8 syntax, no extra options)
mongoose.connect('mongodb://localhost:27017/ecommerceOrders')
    .then(() => console.log('MongoDB connected ' + 'http://localhost:3000/'))
    .catch(err => console.log('MongoDB connection error: ' + err));