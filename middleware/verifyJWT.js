import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  // req.header.token
  try {
    console.log("verify token");
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "wrong header" });
    }

    const accessToken = authHeader.split(" ")[1];
    const decode = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.status(401).json({ msg: err }); // Unauthorized
        req.user = decode;
        next();
      }
    );
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

export default verifyJWT;
