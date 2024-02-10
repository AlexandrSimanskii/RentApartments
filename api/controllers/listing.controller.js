import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(403, "Такого обьявления не существует!"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(403, "Вы не можете удалить чужое обьявление!"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Обьявление удалено!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Такое обьявление не найдено!"));
    }

    if (req.user.id !== listing.userRef) {
      return next(
        errorHandler(401, "Вы можете изменить только свои объявления!")
      );
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
