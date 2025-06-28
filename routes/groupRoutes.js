const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware.authenticateUser);
router.post(
  "/createGroup",
  // authMiddleware.authenticateUser,
  groupController.createGroup
);

router.put("/updateGroupName/:id", groupController.updateGroupName);
router.put(
  "/addMembersinGroup/:id",
  // authMiddleware.authenticateUser,
  groupController.addMembersinGroup
);

router.put(
  "/removeMemberFromGroup/:id",
  // authMiddleware.authenticateUser,
  groupController.removeMemberFromGroup
);

router.get(
  "/getGroupsByUser",
  // authMiddleware.authenticateUser,
  groupController.getGroupsByUser
);

router.post(
  "/createGroups",
  // authMiddleware.authenticateUser,
  groupController.createGroups
);
module.exports = router;
