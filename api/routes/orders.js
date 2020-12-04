const express = require('express');
const router = express.Router();

// Get all orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        msg: "Orders fetched"
    });
    
});

// Create order
router.post('/', (req, res, next) => {
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    }
    res.status(201).json({
        msg : "Order created",
        order : order
    });
});

//Get specific order
router.get('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId
    if(orderId === 'special'){
        res.status(200).json({
            msg: "Order details",
            orderId : req.params.orderId
        });
    } else {
        res.status(200).json({
            msg: "Item not found"
        });
    }
});

// router.patch('/', (req, res, next) => {
//     res.status(200).json({
//         msg: "Updated product"
//     });
// });

// Delete order
router.delete('/', (req, res, next) => {
    res.status(200).json({
        msg: "Deleted order"
    });
});


module.exports = router;