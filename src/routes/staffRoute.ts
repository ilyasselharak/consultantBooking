import express, { Request, Response, NextFunction } from "express";
import { login } from "../controllers/Staff/authController";
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  getOneStaff,
  updateStaff,
} from "../controllers/Staff/staffController";
import { onlySuperAdmin } from "../middlewares/accessControl";

const router = express.Router();


router.post("/login", login);
router
  .route("/")
  .post(onlySuperAdmin, createStaff)
  .get(onlySuperAdmin,getAllStaff);
router
  .route("/:id")
  .get(onlySuperAdmin, getOneStaff)
  .put(onlySuperAdmin, updateStaff)
  .delete(onlySuperAdmin, deleteStaff);

export default router;
