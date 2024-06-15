const queries = {
  mysql: {
    createTable: `CREATE TABLE IF NOT EXISTS test_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        value INT
      );`,
    insert: `INSERT INTO test_table (name, value) VALUES (?, ?);`,
    select: `SELECT * FROM test_table;`,
  },
  postgresql: {
    createTable: `CREATE TABLE IF NOT EXISTS test_table (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          value INT
        );`,
    insert: `INSERT INTO test_table (name, value) VALUES ($1, $2);`,
    select: `SELECT * FROM test_table;`,
  },
  sqlite: {
    createTable: `CREATE TABLE IF NOT EXISTS test_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        value INTEGER
      );`,
    insert: `INSERT INTO test_table (name, value) VALUES (?, ?);`,
    select: `SELECT * FROM test_table;`,
    update: `UPDATE test_table SET value = ? WHERE id = ?;`,
    delete: `DELETE FROM test_table WHERE id = ?;`,
  },
};

const testData = [
  { name: "Alice", value: 100 },
  { name: "Bob", value: 200 },
  { name: "Charlie", value: 300 },
];

module.exports = { queries, testData };
