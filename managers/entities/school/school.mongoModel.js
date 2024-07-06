const mongoose = require("mongoose");
const { Schema } = mongoose;

const SchoolSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
    createdBy:{
      type:mongoose.Types.ObjectId,
      ref:"user"
    },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

let SchoolModel = mongoose.model("school", SchoolSchema);
module.exports = SchoolModel;
