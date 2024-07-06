const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username :{ type: String , required : true },
    mobileNumber: { type: String, required: true, unique: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: function (value) {
          // Use a regular expression to validate email format
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return emailRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: { type: String },
    role:{type : String ,enum: ["superAdmin", "schoolAdmin"]},
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

let UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
