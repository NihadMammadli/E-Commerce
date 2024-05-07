const express = require('express');
const router = express.Router();

router.use('/users', require('./Users'));
router.use('/login', require('./Login'));
router.use('/products', require('./Products'));
router.use('/products_list', require('./ProductsList'));

module.exports = router;
