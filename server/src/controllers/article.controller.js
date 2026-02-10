import { Article } from "../models/article.model.js";

export const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArticles = async (req, res) => {
  try {
    const { status, category, matchId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (matchId) filter.matchId = matchId;

    const articles = await Article.find(filter)
      .populate("author", "name")
      .populate("matchId", "matchTitle")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate("author", "name")
      .populate("matchId");

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
