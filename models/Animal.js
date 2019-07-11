const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const animalSchema = new Schema(
  {
    name: String,
    description: String,
    animalImg: { url: String, originalName: String },
    // {type:Schema.Types.ObjectId, ref:"Post"},
    location: { type: { type: String }, coordinates: [Number] }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

animalSchema.index({ location: "2dsphere" });

const Animal = mongoose.model("Animal", animalSchema);
module.exports = Animal;
