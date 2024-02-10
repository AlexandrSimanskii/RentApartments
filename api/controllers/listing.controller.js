import Listing from "../models/listing.models.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(403, "Такого обьявления не существует!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(403, "Вы не можете удалить чужое обьявление!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Обьявление удалено!");
  } catch (error) {
    next(error);
  }
};
