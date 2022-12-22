import express from "express";
import usersController from "../controllers/users.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

// READ
router.get("/:id", verifyJWT, usersController.getUser);
router.get("/:id/friends", verifyJWT, usersController.getUserFriends);

// UPDATE
router.patch("/:id/:friendId", verifyJWT, usersController.addRemoveFriend);

export default router;
