const user = require("./users.controller.js");
const auth = require("../config/auth.config");
const jwt = require("jsonwebtoken");

exports.auth = async (request, response) => {
  let { email, password } = request.body;
  const userExists = await user.findByEmail(email);

  if (!userExists) {
    return response
      .status(401)
      .json({ error: "There is no userExists with this email" });
  }

  let isValidPassword = password === userExists.password ? true : false;

  if (!isValidPassword) {
    return response.status(401).json({ error: "The password is incorrect" });
  }

  const token = jwt.sign({}, auth.jwt.secret, {
    subject: userExists.id,
    expiresIn: auth.jwt.expiresIn,
  });

  return response.status(200).json({ userExists, token });
};