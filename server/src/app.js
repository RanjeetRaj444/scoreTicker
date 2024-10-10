import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["my-custom-header"],
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

app.use("/api/players", playerRouter);
app.use("/api/venues", venuesRouter);
app.use("/api/matches", matchRouter);

export { server, io };
