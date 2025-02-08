import mongoose from "mongoose";
import { WishlistType } from "../types/types";

const wishlistSchema = new mongoose.Schema<WishlistType>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Wishlist = mongoose.model<WishlistType>("Wishlist", wishlistSchema);

export default Wishlist;
