const db = require("../models");
const Console = db.consoles;

exports.readAll = (req, res) => {
  Console.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Consoles.",
      });
    });
};

exports.readById = (req, res) => {
  const id = req.params.id;
  Console.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Console with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({ message: "Error retrieving Console with id=" + id });
    });
};

exports.readByName = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  Console.find(condition)
    .then((data) => {
      if (data.length == 0)
        res
          .status(404)
          .send({ message: "Not found Console with name " + name });
      else res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Consoles.",
      });
    });
};
