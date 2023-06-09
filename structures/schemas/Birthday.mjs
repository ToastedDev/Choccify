import { model, Schema } from "mongoose";

export default model(
  "birthdays",
  new Schema({
    user: String,
    month: Number,
    day: Number,
    lastSent: Number,
  })
);
