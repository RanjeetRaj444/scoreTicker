import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./db/index.js";
import { server as app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("app error", err);
    });

    app.listen(PORT, () => {
      console.log("server listening on port", PORT);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });
