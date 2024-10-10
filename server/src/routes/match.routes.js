// match routes

import {
	createMatch,
	getMatches,
	getMatch,
	updateMatch,
	deleteMatch,
} from "../controllers/match.controller.js";
import { Router } from "express";

const router = Router();

router.post("/", createMatch);
router.get("/", getMatches);
router.get("/:id", getMatch);
router.patch("/:id", updateMatch);
router.delete("/:id", deleteMatch);

export default router;
