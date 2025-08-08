import { Router } from "express";

import {
  getUserCounts,
  getUserDetails,
  getUsers,
  toggleUserStatus,
} from "../controllers/admin.user.controller";

const router = Router();

router.get("/", getUsers);

router.get("/counts", getUserCounts);

router.patch("/:id/toggle-status", toggleUserStatus);

router.get("/:id", getUserDetails);

export default router;
