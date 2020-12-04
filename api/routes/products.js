const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../../api/models/product');

// Get all Products
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
});

// Create product
router.post('/', (req, res, next) => {
    const product = new Product({
        //_id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                msg : "Created product",
                createdProduct : result
            });
        })
        .catch(err => console.log(err));
        res.status(200).json({
            error: err
        });
});

// Get specific item
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message : 'Not a valid id'});
            }
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
        });
});

// Update product
router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error : err})
        });
});

// Delete product
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.remove({_id : id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;