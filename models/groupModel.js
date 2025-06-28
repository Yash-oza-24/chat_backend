const mongoose = require("mongoose");
const groupSchema = mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    isGroup: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

groupSchema.pre("save", function (next) {
  if (this.members.length === 2) {
    this.isGroup = false;
  }
  next();
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
