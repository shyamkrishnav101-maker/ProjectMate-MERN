import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { updateProfile, dashboard, discoverUsers } from "../controllers/userController.js";
const router = Router();
router.use(protect);
router.get("/dashboard", dashboard);
router.get("/discover", discoverUsers);
router.patch("/profile", updateProfile);
export default router;
