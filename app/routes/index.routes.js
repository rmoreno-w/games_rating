module.exports = app => {
  const user = require("../controllers/users.controller.js");

  var router = require("express").Router();

  // Users Crud
  router.post("/users", user.create);
  router.get("/users", user.readAll);
  router.get("/users/:id", user.readById);
  router.put("/users/:id", user.update);
  router.delete("/users/:id", user.delete);

  app.use("/api", router);
};
