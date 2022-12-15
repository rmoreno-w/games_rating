require("dotenv").config();

module.exports = auth = {
  jwt: {
    secret: process.env.APP_SECRET,
    expiresIn: "1d",
  },
};