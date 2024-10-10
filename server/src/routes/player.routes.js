// player routes

import { Router } from "express";
const router = Router();
import {
	createPlayer,
	getPlayers,
	getPlayer,
	updatePlayer,
	deletePlayer,
} from "../controllers/player.controller.js";

router.post("/", createPlayer);
router.get("/", getPlayers);
router.get("/:id", getPlayer);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);

export default router;
