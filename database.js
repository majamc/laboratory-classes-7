// database.js
const { MongoClient } = require('mongodb');
const { DB_USER, DB_PASS } = require('./config.js');

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@mvczajecia.4flpzh5.mongodb.net/?retryWrites=true&w=majority&appName=MVCZajecia`;
const client = new MongoClient(uri);
let database;

async function mongoConnect(callback) {
  try {
    await client.connect();
    database = client.db('shop');
    console.log("Connection to the database has been established.");
    callback();
  } catch (err) {
    console.error("Connection error:", err);
  }
}

function getDatabase() {
  if (!database) throw new Error("No database found.");
  return database;
}

module.exports = {mongoConnect, getDatabase};