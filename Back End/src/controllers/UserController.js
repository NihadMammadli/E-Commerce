const PostgreSQL = require('../config/PostgreSQL');

class UserController {
  constructor() {
    this.postgreSQL = new PostgreSQL();
    this.postgreSQL.connect();

    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  sendErrorResponse(res, statusCode = 500, errorMessage = 'Internal Server Error') {
    res.status(statusCode).json({ error: errorMessage });
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.postgreSQL.executeQuery('SELECT * FROM users');
      res.json(users);
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }

  async getUserById(req, res) {
    const userId = parseInt(req.params.id);
    try {
      const user = await this.postgreSQL.executeQuery('SELECT * FROM users WHERE id = $1', [userId]);
      if (user.length > 0) {
        res.json(user[0]);
      } else {
        this.sendErrorResponse(res, 404, 'User not found');
      }
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }

  async createUser(req, res) {
    const { name, surname, email, username, password, age, gender } = req.body;
    try {
      const newUser = await this.postgreSQL.executeQuery(
        'INSERT INTO users (name, surname, email, username, password, age, gender) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, surname, email, username, password, age, gender]
      );
      res.status(201).json(newUser[0]);
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }

  async updateUser(req, res) {
    const userId = parseInt(req.params.id);
    const { name, surname, email, username, password, age, gender } = req.body;
    try {
      const updatedUser = await this.postgreSQL.executeQuery(
        'UPDATE users SET name = $1, surname = $2, email = $3, username = $4, password = $5, age = $6, gender = $7 WHERE id = $8 RETURNING *',
        [name, surname, email, username, password, age, gender, userId]
      );
      if (updatedUser.length > 0) {
        res.json(updatedUser[0]);
      } else {
        this.sendErrorResponse(res, 404, 'User not found');
      }
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }

  async deleteUser(req, res) {
    const userId = parseInt(req.params.id);
    try {
      const deletedUser = await this.postgreSQL.executeQuery(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [userId]
      );
      if (deletedUser.length > 0) {
        res.json(deletedUser[0]);
      } else {
        this.sendErrorResponse(res, 404, 'User not found');
      }
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }
}

module.exports = new UserController();