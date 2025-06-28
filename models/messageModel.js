const mongoose = require("mongoose");
const messageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
    },
    file: {
      filename: String,
      path: String,
      size: Number,
      mimetype: String
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
