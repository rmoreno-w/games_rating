const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.users = require("./users.model.js")(mongoose);
db.games = require("./games.model.js")(mongoose);
db.consoles = require("./consoles.model.js")(mongoose);

module.exports = db;
