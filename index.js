const DatabaseClient = require("./dbClient");
const { queries, testData } = require("./queries");

const mysqlConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "test_db",
};

const postgresqlConfig = {
  host: "127.0.0.1",
  user: "postgres",
  password: "1234",
  database: "postgres",
  port: 5432,
};

const sqliteConfig = {
  database: "./test_db.sqlite",
};

const clients = {
  mysql: new DatabaseClient("mysql", mysqlConfig),
  postgresql: new DatabaseClient("postgresql", postgresqlConfig),
  sqlite: new DatabaseClient("sqlite", sqliteConfig),
};

async function measurePerformance(client, query, params = []) {
  const times = [];
  for (let i = 0; i < 10; i++) {
    // Run the query 10 times
    const time = await client.executeQuery(query, params);
    times.push(time);
  }
  return times.reduce((a, b) => a + b, 0) / times.length; // Return average time
}

(async () => {
  for (const [dbName, client] of Object.entries(clients)) {
    await client.connect();
    const dbQueries = queries[dbName];
    await client.executeQuery(dbQueries.createTable);

    console.log(`${dbName.toUpperCase()} Performance:`);

    for (const queryType in dbQueries) {
      if (queryType === "insert") {
        for (const data of testData) {
          await client.executeQuery(dbQueries[queryType], [
            data.name,
            data.value,
          ]);
        }
      } else {
        const avgTime = await measurePerformance(client, dbQueries[queryType]);
        console.log(`${queryType}: ${avgTime.toFixed(2)} ms`);
      }
    }

    await client.close();
    console.log("");
  }
})();
