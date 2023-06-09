import { model, Schema } from "mongoose";

export default model(
  "sleep",
  new Schema({
    user: { type: String, required: true },
    sleeping: { type: Boolean, default: false },
    date: Date,
    sessions: [{ start: { type: Date, required: true }, end: Date }],
  })
);
