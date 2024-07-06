const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new Schema(
  {
    name: { type: String, required: true},
    age: { type: Number, required: true },
    classId:{
      type:mongoose.Types.ObjectId,
      ref:"class"
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

let StudentModel = mongoose.model("student", StudentSchema);
module.exports = StudentModel;
