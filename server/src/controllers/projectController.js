import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listProjects = asyncHandler(async (req, res) => {
  const { search = "", category = "" } = req.query;
  const filter = {};
  if (category && category !== "All") filter.category = category;
  if (search.trim()) filter.$or = [
    { title: { $regex: search.trim(), $options: "i" } },
    { description: { $regex: search.trim(), $options: "i" } },
    { skills: { $regex: search.trim(), $options: "i" } }
  ];
  const projects = await Project.find(filter).populate("owner", "name").populate("members", "name").sort({ createdAt: -1 }).limit(100);
  res.json({ projects });
});
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, category, skills, teamSize, deadline } = req.body;
  if (!title?.trim() || !description?.trim()) return res.status(400).json({ message: "Title and description are required" });
  const project = await Project.create({ title, description, category, skills: Array.isArray(skills) ? skills : [], teamSize: Number(teamSize) || 4, deadline: deadline || undefined, owner: req.user._id, members: [req.user._id] });
  await project.populate("owner", "name");
  res.status(201).json({ project });
});
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("owner", "name email").populate("members", "name email skills").populate("requests.user", "name email skills");
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ project });
});
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: "Only the project owner can edit it" });
  const allowed = ["title", "description", "category", "skills", "teamSize", "deadline"];
  allowed.forEach(k => { if (req.body[k] !== undefined) project[k] = req.body[k]; });
  await project.save();
  res.json({ project });
});
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: "Only the project owner can delete it" });
  await project.deleteOne();
  res.json({ message: "Project deleted" });
});
export const requestJoin = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.members.some(id => id.equals(req.user._id))) return res.status(409).json({ message: "You are already a member" });
  if (project.requests.some(r => r.user.equals(req.user._id) && r.status === "pending")) return res.status(409).json({ message: "You already have a pending request" });
  if (project.members.length >= project.teamSize) return res.status(409).json({ message: "This team is full" });
  project.requests.push({ user: req.user._id });
  await project.save();
  res.status(201).json({ message: "Join request sent" });
});
export const decideRequest = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: "Only the owner can manage requests" });
  const request = project.requests.id(req.params.requestId);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (!["accepted", "rejected"].includes(req.body.status)) return res.status(400).json({ message: "Status must be accepted or rejected" });
  if (req.body.status === "accepted") {
    if (project.members.length >= project.teamSize) return res.status(409).json({ message: "Team is full" });
    if (!project.members.some(id => id.equals(request.user))) project.members.push(request.user);
  }
  request.status = req.body.status;
  await project.save();
  res.json({ message: `Request ${request.status}` });
});
