import { model, Schema } from "mongoose";

export default model(
  "afk",
  new Schema({
    user: String,
    guild: String,
    reason: String,
    date: { type: Date, default: Date.now },
  })
);
