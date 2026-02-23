// orderController.js
const express = require('express');
const Order = require('../models/order.model');

const router = express.Router();

// =============================
// ROUTES
// =============================

// Home & basic pages
router.get('/', (req, res) => res.render('menu'));
router.get('/cart', (req, res) => res.render('cart'));
router.get('/order', (req, res) => res.render('order'));


// Admin page - list all orders
router.get('/admin', async (req, res) => {
    try {
        const orders = await Order.find({}).lean();
        console.log('Orders from DB:', JSON.stringify(orders, null, 2)); // <-- add this
        const { message, type } = req.query;
        res.render('admin', { order: orders, message, type });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Server Error');
    }
});

// Delete order - must come BEFORE /order/:id
router.get('/order/delete/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.redirect('/admin?message=Order deleted&type=success');
    } catch (err) {
        console.error('Error deleting order:', err);
        res.redirect('/admin?message=Delete failed&type=error');
    }
});

// View single order - must come AFTER /order/delete/:id
router.get('/order/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).send('Order not found');
        res.render('orders', { order });
    } catch (err) {
        console.error('Error finding order by ID:', err);
        res.status(500).send('Server Error');
    }
});

// Insert order from cart
router.post('/cart', async (req, res) => insertOrder(req, res));

// Update existing order
router.post('/order', async (req, res) => updateOrder(req, res));

// =============================
// FUNCTIONS
// =============================

// Insert new order
async function insertOrder(req, res) {
    try {
        const order = new Order({
            total: req.body.total,
            order: Date.now().toString()
        });
        await order.save();
        console.log('Order inserted:', order);
        res.redirect('/admin?message=Order added&type=success');
    } catch (err) {
        console.error('Error inserting order:', err);
        res.redirect('/admin?message=Insert failed&type=error');
    }
}

// Update existing order
async function updateOrder(req, res) {
    try {
        const updated = await Order.findOneAndUpdate(
            { _id: req.body._id },
            req.body,
            { new: true }
        );
        if (!updated) return res.redirect('/admin?message=Order not found&type=error');
        res.redirect('/admin?message=Order updated&type=success');
    } catch (err) {
        console.error('Error updating order:', err);
        res.redirect('/admin?message=Update failed&type=error');
    }
}

module.exports = router;