import Staff from "../../models/StaffModel";
import {
  createOne,
  deleteMany,
  getById,
  getMany,
  deleteOne,
} from "../handlersFactory";

export const createStaff = createOne(Staff);

export const getAllStaff = getMany(Staff, {
  path: "permissions",
  model: "Permission",
  select: "-__v"
});

export const getOneStaff = getById(Staff);

export const updateStaff = deleteMany(Staff);

export const deleteStaff = deleteOne(Staff);
