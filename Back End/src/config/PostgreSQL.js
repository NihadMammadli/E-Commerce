const { Client } = require('pg');

class PostgreSQL {
  constructor() {
    this.client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'e-commerce',
      password: 'root',
      port: 5432,
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to PostgreSQL');
    } catch (err) {
      console.error('Error connecting to PostgreSQL', err);
      throw err;
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnected from PostgreSQL');
    } catch (err) {
      console.error('Error disconnecting from PostgreSQL', err);
      throw err;
    }
  }

  async executeQuery(query, params = []) {
    try {
      const result = await this.client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}

module.exports = PostgreSQL;
