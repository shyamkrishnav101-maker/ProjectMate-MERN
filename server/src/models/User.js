import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  college: { type: String, default: "", maxlength: 100 },
  branch: { type: String, default: "", maxlength: 80 },
  year: { type: String, default: "" },
  bio: { type: String, default: "", maxlength: 500 },
  skills: [{ type: String, trim: true }],
  interests: [{ type: String, trim: true }]
}, { timestamps: true });
export default mongoose.model("User", userSchema);
