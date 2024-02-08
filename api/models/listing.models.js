import mongoose from "mongoose";

const Scheme = mongoose.Schema;

const listingSchema = new Scheme(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    regularPrice: {
      type: Number,
      require: true,
    },
    discountPrice: {
      type: Number,
      require: true,
    },
    bathrooms: {
      type: Number,
      require: true,
    },
    bedrooms: {
      type: Number,
      require: true,
    },
    furnished: {
      type: Boolean,
      require: true,
    },
    parking: {
      type: Boolean,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    offer: {
      type: Boolean,
      require: true,
    },
    imageURL: {
      type: Array,
      require: true,
    },
    userRef: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
