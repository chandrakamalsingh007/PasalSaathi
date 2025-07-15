import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email, // if you added email to token payload
    };

    next();
  });
};
