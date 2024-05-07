const express = require('express');
const router = express.Router();

const ProductsListController = require('../controllers').ProductsListController;

router.get('/', ProductsListController.getAllProductTypes);


module.exports = router;
