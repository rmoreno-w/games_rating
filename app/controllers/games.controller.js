const db = require("../models");
const Game = db.games;
const Console = db.consoles;

exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Title can not be empty!" });
    return;
  }
  // Create an Game
  const game = new Game({
    console_id: req.body.console_id,
    title: req.body.title,
    resume: req.body.resume,
    developer: req.body.developer,
    genre: req.body.genre,
    rating: req.body.rating,
    img: req.body.img,
  });

  // Save Game in the database
  game
    .save(game)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating Game.",
      });
    });

  // Update Console
  Console.findByIdAndUpdate(
    req.body.console_id,
    { $push: { games: game._id } },
    { new: true },
    (err) => {
      if (err) {
        return res.status(400).json({
          error: "Error updating Console",
        });
      }
    }
  );
};

exports.readAll = (req, res) => {
  Game.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Games.",
      });
    });
};

exports.readById = (req, res) => {
  const id = req.params.id;
  Game.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Game with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error retrieving Game with id=" + id });
    });
};

exports.readByTitle = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Game.find(condition)
    .then((data) => {
      if (data.length == 0)
        res.status(404).send({ message: "Not found Game with title " + title });
      else res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Games.",
      });
    });
};

exports.readByDeveloper = (req, res) => {
  const developer = req.query.developer;
  var condition = developer
    ? { developer: { $regex: new RegExp(developer), $options: "i" } }
    : {};

  Game.find(condition)
    .then((data) => {
      if (data.length == 0)
        res
          .status(404)
          .send({ message: "Not found Game with developer " + developer });
      else res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Games.",
      });
    });
};

exports.readByGenre = (req, res) => {
  const genre = req.query.genre;
  var condition = genre
    ? { genre: { $regex: new RegExp(genre), $options: "i" } }
    : {};

  Game.find(condition)
    .then((data) => {
      if (data.length == 0)
        res.status(404).send({ message: "Not found Game with genre " + genre });
      else res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Games.",
      });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  const game = req.body;

  Game.findByIdAndUpdate(id, game, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Game with id=${id}. Maybe Game was not found!`,
        });
      } else
        res.send({ message: "Game was updated successfully.", data: game });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Game with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Game.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Game with id=${id}. Maybe Game was not found!`,
        });
      } else {
        res.send({
          message: "Game was deleted successfully!",
          deleted: data,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Could not delete Game with id=" + id,
      });
    });
};

exports.review = async (req, res) => {
  if (!req.body.rating) {
    res.status(400).send({ message: "Rating can not be empty!" });
    return;
  }

  const user_id = req.user.id;

  Game.findById(req.body.game_id, (err, result) => {
    if (!err) {
      if (!result)
        res.status(404).send({ message: "Not found Game with id " + id });
      else {
        result.reviews.push({
          user_id: user_id,
          rating: req.body.rating,
          description: req.body.description,
        });

        let total = 0;
        let count = 0;

        result.reviews.forEach((review) => {
          total += review.rating;
          count++;
        });

        mean = total / count;

        result.rating = mean.toFixed(2);;

        result.save(function (saveerr, saveresult) {
          if (!saveerr) {
            res.status(200).send(saveresult);
          } else {
            res.status(400).send(saveerr.message);
          }
        });
      }
    } else res.send(err);
  });
};

exports.autoComplete = async (req, res) => {
  const genre = req.query.genre;
  const developer = req.query.developer;
  const title = req.query.title;

  if (developer && !genre && !title) {
    let findOptions = { developer: { $regex: new RegExp(developer), $options: "i" } };
    let queryLimit = 5;
    let projection = { _id: 0, developer: 1 };
    await Game.find(findOptions)
      .limit(queryLimit)
      .select(projection)
      .then((data) => {
        if (data.length == 0) res.status(404).send({ message: "Did not found a Game with developer containing " + developer });
        else {
          let flattenedData = [];
          for (key in data) flattenedData.push(data[key].developer);
          let uniqueData = [...new Set(flattenedData)];

          console.log(uniqueData);
          res.send(uniqueData);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving Games.",
        });
      });
  }
  if (title && !genre && !developer) {
    let findOptions = { title: { $regex: new RegExp(title), $options: "i" } };
    let queryLimit = 5;
    let projection = { _id: 0, title: 1 };
    await Game.find(findOptions)
      .limit(queryLimit)
      .select(projection)
      .then((data) => {
        if (data.length == 0) res.status(404).send({ message: "Did not found a Game with title containing " + title });
        else {
          let flattenedData = [];
          for (key in data) flattenedData.push(data[key].title);
          let uniqueData = [...new Set(flattenedData)];

          console.log(uniqueData);
          res.send(uniqueData);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving Games.",
        });
      });
  }
  if (genre && !developer && !title) {
    let findOptions = { genre: { $regex: new RegExp(genre), $options: "i" } };
    let queryLimit = 5;
    let projection = { _id: 0, genre: 1 };
    await Game.find(findOptions)
      .limit(queryLimit)
      .select(projection)
      .then((data) => {
        if (data.length == 0) res.status(404).send({ message: "Did not found a Game with genre containing " + genre });
        else {
          let flattenedData = [];
          for (key in data) flattenedData.push(data[key].genre);
          let uniqueData = [...new Set(flattenedData)];

          console.log(uniqueData);
          res.send(uniqueData);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving Games.",
        });
      });
  }
  // else {
  //     res.status(404).send({
  //         message: 'Wrong parameters for the search. Use only one of the following: developer, title or genre.',
  //     });
  // }
};