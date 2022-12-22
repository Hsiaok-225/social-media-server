import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authController = {
  register: async (req, res) => {
    console.log(req.body);
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation,
      } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json("name, email, password is required");
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewdProfile: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 1000),
      });
      const saveUser = await newUser.save();
      res.status(201).json(saveUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ msg: "email or password is required" });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invaild credentials" });

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      user.password = undefined;
      console.log(user);
      res.status(200).json({ user, accessToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default authController;
