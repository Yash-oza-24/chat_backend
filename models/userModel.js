const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: [true, "Username must be unique"],
  },
  fullname: {
    type: String,
    require: true,
    
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    minlength: 8,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
