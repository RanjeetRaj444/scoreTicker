import { Router } from "express";
import { createVenue, getVenues } from "../controllers/venue.controller.js";

const router = Router();

router.post("/", createVenue);
router.get("/", getVenues);

export default router;
