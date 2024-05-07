const PostgreSQL = require('../config').PostgreSQL;
const { Buffer } = require('buffer');

class UserController {
  constructor() {
    this.postgreSQL = new PostgreSQL();
    this.postgreSQL.connect();

    this.getAllProductTypes = this.getAllProductTypes.bind(this);
  }

  sendErrorResponse(res, statusCode = 500, errorMessage = 'Internal Server Error') {
    res.status(statusCode).json({ error: errorMessage });
  }

  async getAllProductTypes(req, res) {
    try {
      const products = await this.postgreSQL.executeQuery('SELECT id, product_type FROM product_type');
      res.json(products);
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }
}

module.exports = new UserController();
