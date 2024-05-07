const express = require('express');
const router = express.Router();

const ProductsController = require('../controllers').ProductsController;

router.get('/', ProductsController.getAllProducts);
router.get('/:id', ProductsController.getProductById);
router.post('/', ProductsController.createProduct);
router.put('/:id', ProductsController.updateProduct);
router.delete('/:id', ProductsController.deleteProduct);


module.exports = router;
