import express from "express";
import {
  createPermission,
  deletePermission,
  getAllPermission,
  updatePermission,
} from "../controllers/Staff/permissionController";

const router = express.Router();

router.route("/").get(getAllPermission).post(createPermission);
router.route("/:id").put(updatePermission).delete(deletePermission);

export default router;
