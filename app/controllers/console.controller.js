const db = require("../models");
const Console = db.consoles;
const Game = db.games;

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

exports.getTopGames = async (req, res) => {
  const id = req.params.id;

  const gamesFound = (await Console.findById(id, "games")).games;

  const result = gamesFound.map(async (game) => {
    const gameFound = await Game.findById(game);
    return gameFound;
  });

  let allGames = await Promise.all(result);

  // Bouble Sort for orderning descending
  for (var i = 0; i < allGames.length; i++) {
    for (var j = 0; j < allGames.length; j++) {
      if (allGames[i].rating > allGames[j].rating) {
        var temp = allGames[i];
        allGames[i] = allGames[j];
        allGames[j] = temp;
      }
    }
  }

  res.send(allGames.slice(0, 3));
};
