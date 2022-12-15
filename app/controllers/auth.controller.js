const user = require("./users.controller.js");
const auth = require("../config/auth.config");
const jwt = require("jsonwebtoken");

exports.auth = async (request, response) => {
  let { email, password } = request.body;
  const employee = await user.findByEmail(email);

  if (!employee) {
    return response
      .status(401)
      .json({ error: "There is no employee with this email" });
  }

  let isValidPassword = password === employee.password ? true : false;

  if (!isValidPassword) {
    return response.status(401).json({ error: "The password is incorrect" });
  }

  const token = jwt.sign({}, auth.jwt.secret, {
    subject: employee.id,
    expiresIn: auth.jwt.expiresIn,
  });

  return response.status(200).json({ employee, token });
};