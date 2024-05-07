const PostgreSQL = require('../config').PostgreSQL;
const { Buffer } = require('buffer');

class UserController {
  constructor() {
    this.postgreSQL = new PostgreSQL();
    this.postgreSQL.connect();

    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.checkUser = this.checkUser.bind(this);
  }

  sendErrorResponse(res, statusCode = 500, errorMessage = 'Internal Server Error') {
    res.status(statusCode).json({ error: errorMessage });
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.postgreSQL.executeQuery('SELECT id, name, surname, email, age, gender FROM users');
      res.json(users);
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }

  async getUserById(req, res) {
    const userId = parseInt(req.params.id);
    try {
      const user = await this.postgreSQL.executeQuery('SELECT id, name, surname, email, age, gender FROM users WHERE id = $1', [userId]);
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
      const passwordBase64 = Buffer.from(password).toString('base64'); // Encode password to Base64
      const newUser = await this.postgreSQL.executeQuery(
        'INSERT INTO users (name, surname, email, username, password, age, gender) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, surname, email, age, gender',
        [name, surname, email, username, passwordBase64, age, gender]
      );
      res.status(201).json(newUser[0]);
    } catch (error) {
      this.sendErrorResponse(res);
    }
  }

  // async updateUser(req, res) {
  //   const userId = parseInt(req.params.id);
  //   const { name, surname, email, username, password, age, gender } = req.body;
  //   try {
  //     const passwordBase64 = Buffer.from(password).toString('base64'); // Encode password to Base64
  //     const updatedUser = await this.postgreSQL.executeQuery(
  //       'UPDATE users SET name = $1, surname = $2, email = $3, username = $4, password = $5, age = $6, gender = $7 WHERE id = $8 RETURNING id, name, surname, email, age, gender',
  //       [name, surname, email, username, passwordBase64, age, gender, userId]
  //     );
  //     if (updatedUser.length > 0) {
  //       res.json(updatedUser[0]);
  //     } else {
  //       this.sendErrorResponse(res, 404, 'User not found');
  //     }
  //   } catch (error) {
  //     this.sendErrorResponse(res);
  //   }
  // }

  async updateUser(req, res) {
    const userId = parseInt(req.params.id);
    const { name, surname, email, username, password, age, gender } = req.body;
  
    try {
      const updateUserFields = [];
      const queryParams = [];
      
      if (name) {
        updateUserFields.push(`name = $${queryParams.length + 1}`);
        queryParams.push(name);
      }
      if (surname) {
        updateUserFields.push(`surname = $${queryParams.length + 1}`);
        queryParams.push(surname);
      }
      if (email) {
        updateUserFields.push(`email = $${queryParams.length + 1}`);
        queryParams.push(email);
      }
      if (username) {
        updateUserFields.push(`username = $${queryParams.length + 1}`);
        queryParams.push(username);
      }
      if (password) {
        const passwordBase64 = Buffer.from(password).toString('base64');
        updateUserFields.push(`password = $${queryParams.length + 1}`);
        queryParams.push(passwordBase64);
      }
      if (age) {
        updateUserFields.push(`age = $${queryParams.length + 1}`);
        queryParams.push(age);
      }
      if (gender) {
        updateUserFields.push(`gender = $${queryParams.length + 1}`);
        queryParams.push(gender);
      }
      
      const query = `UPDATE users SET ${updateUserFields.join(', ')} WHERE id = $${queryParams.length + 1} RETURNING id, name, surname, email, age, gender`;
      queryParams.push(userId);
      
      const updatedUser = await this.postgreSQL.executeQuery(query, queryParams);
      
      if (updatedUser.length > 0) {
        res.json(updatedUser[0]);
      } else {
        this.sendErrorResponse(res, 404, 'User not found');
      }
    } catch (error) {
      console.error(`Error updating user with id ${userId}`, error);
      this.sendErrorResponse(res);
    }
  }

  
  async deleteUser(req, res) {
    const userId = parseInt(req.params.id);
    try {
      const deletedUser = await this.postgreSQL.executeQuery(
        'DELETE FROM users WHERE id = $1 RETURNING id, name, surname, email, age, gender',
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

  async checkUser(req, res) {
    const { email, password } = req.body;
  
    try {
      const user = await this.postgreSQL.executeQuery('SELECT password FROM users WHERE email = $1', [email]);
      if (user.length > 0) {
        const storedPassword = Buffer.from(user[0].password, 'base64').toString(); 
        const passwordMatch = storedPassword === password;
        
        if (passwordMatch) {
          res.status(200).json({ match: true });
        } else {
          res.status(200).json({ match: false });
        }
      } else {
        res.status(404).json({ error: 'Email not found' });
      }
    } catch (error) {
      console.error('Error checking password by email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new UserController();
