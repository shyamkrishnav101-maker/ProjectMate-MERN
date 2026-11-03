import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { type: String, default: "FSD" },
  skills: [{ type: String, trim: true }],
  teamSize: { type: Number, default: 4, min: 1, max: 20 },
  deadline: { type: Date },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  requests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
export default mongoose.model("Project", projectSchema);
