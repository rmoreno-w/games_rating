const db = require("../models");
const Disciplina = db.disciplinas;

exports.create = (req, res) => {
  if (!req.body.codigo) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a Disciplina
  const disciplina = new Disciplina({
    codigo: req.body.codigo,
    nome: req.body.nome,
    créditos: req.body.creditos,
  });

  // Save Disciplina in the database
  disciplina
    .save({ créditos: disciplina.créditos, ...disciplina })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating disciplinas.",
      });
    });
};

// Retrieve all Disciplinas from the database.
exports.findAll = (req, res) => {
  const nome = req.query.nome;

  var condition = nome
    ? { nome: { $regex: new RegExp(nome), $options: "i" } }
    : {};

  Disciplina.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving disciplinas.",
      });
    });
};

// Find a single Disciplina with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Disciplina.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Disciplina with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Disciplina with id=" + id });
    });
};

// Update a Disciplina by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  const disc = req.body;
  delete disc['créditos']
  Disciplina.findByIdAndUpdate(
    id,
    {'créditos': parseInt(disc.creditos), ...disc},
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Disciplina with id=${id}. Maybe Disciplina was not found!`,
        });
      } else res.send({ message: "Disciplina was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Disciplina with id=" + id,
      });
    });
};

// Delete a Disciplina with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Disciplina.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Disciplina with id=${id}. Maybe Disciplina was not found!`,
        });
      } else {
        res.send({
          message: "Disciplina was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Disciplina.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Disciplinas were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all disciplinas.",
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Disciplina.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving disciplinas.",
      });
    });
};
