const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./reviews");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  image: {
    default:
      "https://images.unsplash.com/photo-1613046555475-8971e17c205e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: String,
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1613046555475-8971e17c205e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) await review.deleteMany({ _id: { $in: listing.reviews } });
});
const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;
