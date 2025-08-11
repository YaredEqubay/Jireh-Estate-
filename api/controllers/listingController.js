import Listing from "../models/listingModel.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing" });
  }
};
