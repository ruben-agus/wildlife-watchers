const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const randomSchema = new Schema(
  {
    name: String,
    description: String,
    animalImg: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

randomSchema.index({ location: "2dsphere" });

const Random = mongoose.model("Random", randomSchema);
module.exports = Random;