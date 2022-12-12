module.exports = app => {
  const discip = require("../controllers/disciplinas.controller.js");

  var router = require("express").Router();

  router.post("/", discip.create);

  router.get("/", discip.findAll);

  router.get("/:id", discip.findOne);

  router.put("/:id", discip.update);

  router.delete("/:id", discip.delete);

  router.delete("/", discip.deleteAll);

  app.use("/api/discip", router);
};
