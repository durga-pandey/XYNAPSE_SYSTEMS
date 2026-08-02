import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, maxlength: 200 },
    description: { type: String, trim: true },

    image: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },

    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: "version",
  }
);

GallerySchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted"))
    this.where({ isDeleted: false });
  next();
});

const Gallery = mongoose.model("Gallery", GallerySchema);
export default Gallery;
