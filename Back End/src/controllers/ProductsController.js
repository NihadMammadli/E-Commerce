const PostgreSQL = require('../config').PostgreSQL;
const { Buffer } = require('buffer');

class UserController {
  constructor() {
    this.postgreSQL = new PostgreSQL();
    this.postgreSQL.connect();

    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  sendErrorResponse(res, statusCode = 500, errorMessage = 'Internal Server Error') {
    res.status(statusCode).json({ error: errorMessage });
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.postgreSQL.executeQuery('SELECT id, product_name, description, image_url, product_type_id, color, price, rating, quantity FROM products');
      res.json(products);
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }

  async getProductById(req, res) {
    const productId = parseInt(req.params.id);
    try {
      const product = await this.postgreSQL.executeQuery(
        'SELECT id, product_name, description, image_url, product_type_id, color, price, rating, quantity FROM products WHERE id = $1',
        [productId]
      );
      if (product.length > 0) {
        res.json(product[0]);
      } else {
        this.sendErrorResponse(res, 404, 'Product not found');
      }
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }

  async createProduct(req, res) {
    const { product_name, description, image_url, product_type_id, color, price, rating, quantity } = req.body;
    console.log('Request Body:', image_url);
    try {
      const newProduct = await this.postgreSQL.executeQuery(
        'INSERT INTO products (product_name, description, image_url, product_type_id, color, price, rating, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, product_name, description, image_url, product_type_id, color, price, rating, quantity',
        [product_name, description, image_url, product_type_id, color, price, rating, quantity]
        
      );
      if (newProduct.length > 0) {
        res.status(201).json(newProduct[0]);
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      this.sendErrorResponse(res);
    }
  }

  async updateProduct(req, res) {
    const productId = parseInt(req.params.id);
    const { product_name, description, image_url, product_type_id, color, price, rating } = req.body;

    try {
      const updatedProduct = await this.postgreSQL.executeQuery(
        'UPDATE products SET product_name = $1, description = $2, image_url = $3, product_type_id = $4, color = $5, price = $6, rating = $7, quantity = $8 WHERE id = $9 RETURNING id, product_name, description, image_url, product_type_id, color, price, rating, quantity',
        [product_name, description, image_url, product_type_id, color, price, rating, quantity, productId]
      );

      if (updatedProduct.length > 0) {
        res.json(updatedProduct[0]);
      } else {
        this.sendErrorResponse(res, 404, 'Product not found');
      }
    } catch (error) {
      console.error(`Error updating product with id ${productId}`, error);
      this.sendErrorResponse(res);
    }
  }

  async deleteProduct(req, res) {
    const productId = parseInt(req.params.id);
    try {
      const deletedProduct = await this.postgreSQL.executeQuery(
        'DELETE FROM products WHERE id = $1 RETURNING id, product_name, description, image_url, product_type_id, color, price, rating, quantity',
        [productId]
      );
      if (deletedProduct.length > 0) {
        res.json(deletedProduct[0]);
      } else {
        this.sendErrorResponse(res, 404, 'Product not found');
      }
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }
}

module.exports = new UserController();
