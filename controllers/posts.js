import Post from "../models/Post.js";
import User from "../models/User.js";

const postsController = {
  createPost: async (req, res) => {
    try {
      const { userId, description, picturePath } = req.body;
      if (!userId || !description) {
        return res.status(400).json({ msg: "userId, description is required" });
      }
      const user = await User.findById(userId);
      // console.log(user.lastName);
      if (!user) {
        return res.status(400).json({ msg: "user not found" });
      }
      const newPost = await new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes: {},
        comments: [],
      });
      // console.log(newPost);
      await newPost.save();

      /* GET ALL POSTS */
      const post = await Post.find().sort({ createdAt: -1 });
      console.log(post);
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  },
  getFeedPosts: async (req, res) => {
    try {
      const feedPosts = await Post.find().sort({ createdAt: -1 });
      res.status(200).json(feedPosts);
    } catch (err) {
      res.status(404).json({ msg: err });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const userPosts = await Post.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json(userPosts);
    } catch (err) {
      res.status(404).json({ msg: err });
    }
  },
  likePost: async (req, res) => {
    try {
      // console.log(req.body);
      const { id } = req.params; // postId
      const { userId } = req.body; // userId
      const post = await Post.findById(id);

      // isLiked = Map.get(userId)
      const isLiked = post.likes.get(userId);

      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
      }

      const updataPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
      res.status(200).json(updataPost);
    } catch (err) {
      res.status(404).json({ msg: err });
    }
  },
};

export default postsController;
