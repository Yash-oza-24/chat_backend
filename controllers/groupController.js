const Group = require("../models/groupModel");
const User = require("../models/userModel");

const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    console.log(members);
    const user = req.user;
    console.log("1")
    console.log(user)
    let existingGroup;
    if (members.length === 1) {
      existingGroup = await Group.findOne({
        $or: [
          { members: { $all: [user._id, ...members] } },
          { members: { $all: [...members, user._id] } },
        ],
      });
    }
    console.log("2")
    console.log(existingGroup)
    if (existingGroup) {
      res.status(200).json({ message: "Group already exists", existingGroup });
    } else {
      members?.push(user._id);
      const newGroup = new Group({
        groupName,
        members,
        isGroup: true,
        isAdmin: user._id,
      });
      console.log("3")
      await newGroup.save();
        // if (newGroup.members.length === 2) {
        //   newGroup.isAdmin = req.user._id;
        //   await newGroup.save();
        // }
      console.log("4")
      res.status(201).json({ message: "Group created successfully", newGroup });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const createGroups = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    const user = req.user;
    // console.log(user)
    members?.push(user._id);
    const newGroup = new Group({
      groupName,
      members,
      isAdmin: user._id,
      isGroup: true,
    });
    await newGroup.save();
    res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
const updateGroupName = async (req, res) => {
  try {
    const { groupName } = req.body;
    const groupId = req.params.id;
    let group;
    group = await Group.findByIdAndUpdate(
      groupId,
      { groupName },
      { new: true }
    );
    await group.save();
    res.status(200).json({ message: "Group name updated successfully", group });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
const addMembersinGroup = async (req, res) => {
  try {
    const { members } = req.body;
    const groupId = req.params.id;
    const user = req.user;
    const group = await Group.findById(groupId);
    if (group && group.isAdmin.toString() === user._id.toString()) {
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          $push: { members: { $each: members } },
        },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Members added successfully", updatedGroup });
    } else {
      res.status(401).json({
        message: "You are not authorized to add members to this group",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
const removeMemberFromGroup = async (req, res) => {
  try {
    const { memberId } = req.body;
    const groupId = req.params.id;
    const user = req.user;
    const group = await Group.findById(groupId);
    if (group && group.isAdmin.toString() === user._id.toString()) {
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          $pull: { members: memberId },
        },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Members Removed successfully", updatedGroup });
    } else {
      res.status(401).json({
        message: "You are not authorized to remove members from this group",
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};

const getGroupsByUser = async (req, res) => {
  try {
    const user = req.user;
    const groups = await Group.find({ members: { $in: [user._id] } });
    const members = await User.find({
      _id: { $in: groups.flatMap((group) => group._doc.members) },
    });
    // console.log(members);
    const groupsWithMembers = groups.map((group) => ({
      ...group._doc,
      members: members.filter((member) =>
        group._doc.members.includes(member._id.toString())
      ),
    }));
    // console.log(groupsWithMembers);
    res.status(200).json({
      message: "Groups fetched successfully",
      groups: groupsWithMembers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGroup,
  updateGroupName,
  addMembersinGroup,
  removeMemberFromGroup,
  getGroupsByUser,
  createGroups,
};
