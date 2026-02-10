import { Router } from "express";
import {
  createArticle,
  getArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

const router = Router();

router.post("/", createArticle);
router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
