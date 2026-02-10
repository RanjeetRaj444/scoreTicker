import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
const corsOrigin2 = process.env.CORS_ORIGIN2;
console.log("-----------------------------------------");
console.log("SERVER STARTUP DIAGNOSTICS");
console.log("CWD:", process.cwd());
console.log("CORS_ORIGIN env:", process.env.CORS_ORIGIN);
console.log("Effective CORS Origin:", corsOrigin);
console.log("-----------------------------------------");

app.use(
  cors({
    origin: [corsOrigin, corsOrigin2],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("joinMatchRoom", (matchId) => {
    socket.join(matchId);
  });

  // Leave room
  socket.on("leaveMatchRoom", (matchId) => {
    socket.leave(matchId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

import playerRouter from "./routes/player.routes.js";
import venuesRouter from "./routes/venue.routes.js";
import matchRouter from "./routes/match.routes.js";
import userRouter from "./routes/user.routes.js";
import articleRouter from "./routes/article.routes.js";
import adRouter from "./routes/ad.routes.js";

app.use("/api/players", playerRouter);
app.use("/api/venues", venuesRouter);
app.use("/api/matches", matchRouter);
app.use("/api/users", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/ads", adRouter);

export { server, io };
