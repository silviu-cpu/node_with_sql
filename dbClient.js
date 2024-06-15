const mysql = require("mysql2/promise");
const { Client } = require("pg");
const sqlite3 = require("sqlite3").verbose();

class DatabaseClient {
  constructor(dbType, config) {
    this.dbType = dbType;
    this.config = config;
    this.connection = null;
  }

  async connect() {
    if (this.dbType === "mysql") {
      this.connection = await mysql.createConnection(this.config);
    } else if (this.dbType === "postgresql") {
      this.connection = new Client(this.config);
      await this.connection.connect();
    } else if (this.dbType === "sqlite") {
      this.connection = new sqlite3.Database(this.config.database);
    } else {
      throw new Error("Unsupported database type");
    }
  }

  async executeQuery(query, params = []) {
    if (this.dbType === "mysql") {
      const start = process.hrtime();
      await this.connection.execute(query, params);
      const end = process.hrtime(start);
      return end[0] * 1000 + end[1] / 1000000; // Convert to milliseconds
    } else if (this.dbType === "postgresql") {
      const start = process.hrtime();
      await this.connection.query(query, params);
      const end = process.hrtime(start);
      return end[0] * 1000 + end[1] / 1000000; // Convert to milliseconds
    } else if (this.dbType === "sqlite") {
      return new Promise((resolve, reject) => {
        const start = process.hrtime();
        this.connection.run(query, params, function (err) {
          if (err) reject(err);
          const end = process.hrtime(start);
          resolve(end[0] * 1000 + end[1] / 1000000); // Convert to milliseconds
        });
      });
    }
  }

  close() {
    if (this.dbType === "mysql" || this.dbType === "postgresql") {
      return this.connection.end();
    } else if (this.dbType === "sqlite") {
      return new Promise((resolve) => {
        this.connection.close(() => {
          resolve();
        });
      });
    }
  }
}

module.exports = DatabaseClient;
