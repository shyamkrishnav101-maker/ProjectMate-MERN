import User from "../models/User.js";
import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const updateProfile = asyncHandler(async (req, res) => {
  const fields = ["name", "college", "branch", "year", "bio", "skills", "interests"];
  fields.forEach(k => { if (req.body[k] !== undefined) req.user[k] = req.body[k]; });
  await req.user.save();
  const u = req.user;
  res.json({ user: { id:u._id, name:u.name, email:u.email, college:u.college, branch:u.branch, year:u.year, bio:u.bio, skills:u.skills, interests:u.interests } });
});

export const dashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const availableFilter = {
    owner: { $ne: userId },
    members: { $ne: userId },
    requests: {
      $not: {
        $elemMatch: {
          user: userId,
          status: "pending"
        }
      }
    },
    $expr: {
      $lt: [
        { $size: { $ifNull: ["$members", []] } },
        "$teamSize"
      ]
    }
  };

  const [projectsAvailable, projectsCreated, teamsJoined, recent] =
    await Promise.all([
      Project.countDocuments(availableFilter),
      Project.countDocuments({ owner: userId }),
      Project.countDocuments({
        members: userId,
        owner: { $ne: userId }
      }),
      Project.find(availableFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("owner", "name")
        .populate("members", "name")
    ]);

  res.json({
    stats: {
      projects: projectsAvailable,
      owned: projectsCreated,
      joined: teamsJoined
    },
    recent
  });
});

export const discoverUsers = asyncHandler(async (req,res) => {
  const users = await User.find({ _id:{ $ne:req.user._id } }).select("name college branch year bio skills interests").limit(60);
  const mine = new Set((req.user.skills || []).map(s=>s.toLowerCase()));
  const people = users.map(u => {
    const skills = u.skills || [];
    const overlap = skills.filter(s=>mine.has(s.toLowerCase())).length;
    const score = skills.length ? Math.round(overlap / Math.max(mine.size, skills.length, 1) * 100) : 0;
    return { ...u.toObject(), matchScore:score };
  }).sort((a,b)=>b.matchScore-a.matchScore);
  res.json({ users:people });
});
