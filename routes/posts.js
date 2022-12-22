import express from "express";
import postsController from "../controllers/posts.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

/* READ */
router.get("/", verifyJWT, postsController.getFeedPosts);
router.get("/:userId/posts", verifyJWT, postsController.getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyJWT, postsController.likePost);

export default router;
