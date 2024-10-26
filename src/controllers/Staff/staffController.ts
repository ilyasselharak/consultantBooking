import Staff from "../../models/StaffModel";
import {
  createOne,
  deleteMany,
  getById,
  getMany,
  deleteOne,
} from "../handlersFactory";

export const createStaff = createOne(Staff);

export const getAllStaff = getMany(Staff, "-__v -password");

export const getOneStaff = getById(Staff);

export const updateStaff = deleteMany(Staff);

export const deleteStaff = deleteOne(Staff);
