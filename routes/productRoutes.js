const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const authenticateAccessToken = require('../middleware/authenticateAccessToken');
const isAdmin = require('../middleware/isAdmin');

// Get products
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 100 } = req.query;

        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            products,
            totalProducts,
            totalPages,
            currentPage: parseInt(page),
            perPage: parseInt(limit)
        });

    } catch (error) {
        res.status(500).send(`Error fetching products: ${error.message}`);
    }
});

//search
router.get('/search', async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const regex = new RegExp(searchTerm, 'i');
        const products = await Product.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } },
                // { category: { $regex: regex } }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).send(`Error searching products: ${error.message}`);
    }
});

// Create 
router.post('/create', async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { name, description, price, modelName, gallery, stock } = req.body;

        if (!name || !description || !price || !modelName || !gallery || !stock) {
            return res.status(400).send('All fields are required');
        }

        const newProduct = new Product({
            name,
            description,
            price,
            modelName,
            gallery,
            stock,
            rating: 0.0,
            likes: 0,
            reviews: 0
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: `Error creating product: ${error.message}`, error: error.errors });
    }
});


// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (error) {
        res.status(500).send(`Error fetching product: ${error.message}`);
    }
});

// Update product
router.put('/update/:id', authenticateAccessToken, async (req, res) => {
    try {

        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send('Invalid product ID');
        }

        const { name, description, price, modelName, gallery, stock } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send('Product not found');
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.modelName = modelName || product.modelName;
        product.gallery = gallery || product.gallery;
        product.stock = stock || product.stock;


        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).send(`Error updating product: ${error.message}`);
    }
});

// Delete product
router.delete('/:id', authenticateAccessToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send('Invalid product ID');
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.status(200).json({ message: 'Product deleted successfully', product });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send(`Error deleting product: ${error.message}`);
    }
});

module.exports = router;