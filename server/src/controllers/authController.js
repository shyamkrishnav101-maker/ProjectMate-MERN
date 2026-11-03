import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, college: u.college, branch: u.branch, year: u.year, bio: u.bio, skills: u.skills, interests: u.interests });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 8) return res.status(400).json({ message: "Password must contain at least 8 characters" });
  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) return res.status(409).json({ message: "An account with this email already exists" });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ token: tokenFor(user._id), user: publicUser(user) });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase().trim() }).select("+password");
  if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Email or password is incorrect" });
  res.json({ token: tokenFor(user._id), user: publicUser(user) });
});
export const me = asyncHandler(async (req, res) => res.json({ user: publicUser(req.user) }));
