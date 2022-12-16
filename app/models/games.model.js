module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        title: String,
        resume: String,
        developer: String,
        genre: String,
        rating: Number,
        img: String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const Game = mongoose.model("game", schema, "game");
    return Game;
  };
  