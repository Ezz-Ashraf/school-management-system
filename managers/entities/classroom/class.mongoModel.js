const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClassSchema = new Schema(
  {
    name: { type: String, required: true},
    schoolId:{
      type:mongoose.Types.ObjectId,
      ref:"school"
    },
    createdBy:{
      type:mongoose.Types.ObjectId,
      ref:"user"
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

let ClassModel = mongoose.model("class", ClassSchema);
module.exports = ClassModel;
