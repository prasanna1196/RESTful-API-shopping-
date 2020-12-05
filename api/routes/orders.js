const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../../api/models/order');
const Product = require('../../api/models/product');

// Get all orders
router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id : doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                }),
                
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    
});

// Create order
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        const order = new Order ({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity,
    
        });
    return order.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});


//Get specific order
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .populate('product')
    .select('product quantity _id')
        .exec()
        .then(order => {
            if(!order) {
                return res.status(404).json({message : 'Not a valid id'});               
            };
            res.status(200).json({
                placedOrder: order,
                request: {
                    type: 'GET',
                    description: 'Get all orders in the link below',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


// Delete order
router.delete('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
    Order.deleteOne({_id : orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: { name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;