import mongoose from "mongoose";


type WishlistType = {
  _id:mongoose.Schema.Types.ObjectId;
  userId:mongoose.Schema.Types.ObjectId;
  hotelId: mongoose.Schema.Types.ObjectId;
  status:boolean;
}

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
