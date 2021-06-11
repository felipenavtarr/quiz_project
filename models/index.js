const path = require('path');

// Load ORM
const Sequelize = require('sequelize');

// Environment variable to define the URL of the data base to use.
// To use SQLite data base:
//    DATABASE_URL = sqlite:quiz.sqlite
const url = process.env.DATABASE_URL || "sqlite:quiz.sqlite";

const sequelize = new Sequelize(url);

// Import Quiz Table definition from quiz.js
sequelize.import(path.join(__dirname, 'quiz'));

// Import Users Table definition from user.js
sequelize.import(path.join(__dirname, 'user'));

// Session
sequelize.import(path.join(__dirname, 'session'));

module.exports = sequelize;
