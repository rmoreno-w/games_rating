const auth = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");

module.exports = function isAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: "Token is missing!" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decodedToken = jwt.verify(token, auth.jwt.secret);

    const { sub } = decodedToken;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    return response.status(401).json({ error: "Invalid Token!" });
  }
};