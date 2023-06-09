// process.env
import "dotenv/config";

// Bot
import { BotClient } from "./structures/BotClient.mjs";
import { ActivityType, Partials } from "discord.js";

const client = new BotClient({
  allowedMentions: {
    parse: [],
    users: [],
    roles: [],
  },
  partials: [Partials.Message, Partials.Reaction, Partials.Channel],
});

client.init();

// MongoDB
import mongoose from "mongoose";
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB."));

// Leveling
import Levels from "discord.js-leveling";
Levels.setURL(process.env.MONGODB_URL);
