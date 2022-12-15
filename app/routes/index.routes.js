module.exports = (app) => {
  const user = require("../controllers/users.controller.js");
  const session = require("../controllers/auth.controller.js");
  const isAuthenticated = require("../middlewares/isAuthenticated.js");
  
  var router = require("express").Router();

  // Auth
  router.post("/login", session.auth);

  // Users Crud
  router.post("/users", user.create);
  router.get("/users", isAuthenticated, user.readAll);
  router.get("/users/:id", user.readById);
  router.put("/users/:id", user.update);
  router.delete("/users/:id", user.delete);

  app.use("/api", router);
};
