module.exports = (mongoose) => {
  const reviewSchema = mongoose.Schema(
    {
      user_id: String,
      rating: Number,
      description: String,
    },
    { timestamps: true }
  );

  var schema = mongoose.Schema(
    {
      console_id: String,
      title: String,
      resume: String,
      developer: String,
      genre: String,
      rating: Number,
      img: String,
      reviews: [reviewSchema],
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Game = mongoose.model("game", schema, "game");
  return Game;
};
