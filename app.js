const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Import Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Connect to DB
mongoose.connect(
    "mongodb://localhost:27017/academind",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));


// Middleware for parsing json
app.use(express.json());

// CORS Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes)

// Error messages
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



app.listen(3000, () => console.log('Listening on port 3000')); 
