const Message = require("../models/messageModel");
const Group = require("../models/groupModel");
const path = require('path');
const fs = require('fs');

const getMessages = async (req, res) => {
  try {
    const groupId = req.params.id;
    const messages = await Message.find({ groupId: groupId }).sort({
      createdAt: 1,
    });
    res.status(200).json({ message: "Messages fetched from group", messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addMessage = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { message, username } = req.body;
    if (!message || !username) {
      return res.status(400).json({ message: "Text and sender are required" });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const newmessage = new Message({ message, username, groupId });
    await newmessage.save();
    res.status(201).json({ message: "Message added successfully", newmessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    res.status(200).json({ message: "Message deleted successfully", deletedMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { username } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const newMessage = new Message({
      message: `File: ${req.file.originalname}`,
      username,
      groupId,
      file: {
        filename: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

    await newMessage.save();
    res.status(201).json({ message: "File uploaded successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await Message.findById(messageId);

    if (!message || !message.file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, '..', message.file.path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, message.file.filename);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, addMessage, deleteMessage, uploadFile, downloadFile };
