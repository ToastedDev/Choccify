import { model, Schema } from "mongoose";

export default model(
  "time",
  new Schema({
    user: String,
    timezone: String,
  })
);
