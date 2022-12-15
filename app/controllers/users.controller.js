const db = require("../models");
const User = db.users;

exports.create = (req, res) => {
  if (!req.body.email) {
    res.status(400).send({ message: "Email can not be empty!" });
    return;
  }
  // Create an User

  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  });

  // Save User in the database
  user
    .save(user)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating User.",
      });
    });
};

exports.readAll = (req, res) => {
  const nome = req.query.nome;

  var condition = nome
    ? { nome: { $regex: new RegExp(nome), $options: "i" } }
    : {};

  User.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.readById = (req, res) => {
  const id = req.params.id;
  console.log(id);
  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error retrieving User with id=" + id });
    });
};

 exports.findByEmail = (email) => {
   var condition = email
     ? { email: { $regex: new RegExp(email), $options: "i" } }
     : {};
   return User.findOne(condition)
     .then((data) => {
       return data;
     })
     .catch((err) => {
       return err;
     });
 };

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  const user = req.body;

  User.findByIdAndUpdate(id, user, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
        });
      } else
        res.send({ message: "User was updated successfully.", data: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      } else {
        res.send({
          message: "User was deleted successfully!",
          deleted: data
        });
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};