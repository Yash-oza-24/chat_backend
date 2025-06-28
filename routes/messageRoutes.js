const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const upload = require("../utils/fileUpload");

router.get("/getMessages/:id", messageController.getMessages);
router.post("/addMessage/:id", messageController.addMessage);
router.delete("/deleteMessage/:id", messageController.deleteMessage);
router.post("/uploadFile/:id", upload.single('file'), messageController.uploadFile);
router.get("/downloadFile/:id", messageController.downloadFile);

module.exports = router;
    