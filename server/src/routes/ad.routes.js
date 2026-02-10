import { Router } from "express";
import {
  createAd,
  getAds,
  updateAd,
  deleteAd,
  recordImpression,
  recordClick,
} from "../controllers/ad.controller.js";

const router = Router();

router.post("/", createAd);
router.get("/", getAds);
router.patch("/:id", updateAd);
router.delete("/:id", deleteAd);
router.post("/:id/impression", recordImpression);
router.post("/:id/click", recordClick);

export default router;
