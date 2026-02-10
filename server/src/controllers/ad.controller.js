import { Ad } from "../models/ad.model.js";

export const createAd = async (req, res) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAds = async (req, res) => {
  try {
    const { status, placement } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (placement) filter.placement = placement;

    const ads = await Ad.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!ad)
      return res.status(404).json({ success: false, message: "Ad not found" });
    res.status(200).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad)
      return res.status(404).json({ success: false, message: "Ad not found" });
    res.status(200).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recordImpression = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { impressions: 1 } },
      { new: true },
    );
    res.status(200).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recordClick = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true },
    );
    res.status(200).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
