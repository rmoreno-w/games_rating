module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: String,
        games: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "game"
            }
        ]
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const Console = mongoose.model("console", schema, "console");
    return Console;
  };
  