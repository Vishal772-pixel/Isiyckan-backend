import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    unique: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  }
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);