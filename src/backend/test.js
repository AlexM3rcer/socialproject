const Database = require('./db');

async function main() {
  const db = new Database();
  db.connect();
}