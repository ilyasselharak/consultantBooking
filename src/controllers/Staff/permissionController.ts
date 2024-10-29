import Permission from "../../models/PermissionModel";
import {
  createOne,
  deleteMany,
  getById,
  getMany,
  deleteOne,
} from "../handlersFactory";

export const createPermission = createOne(Permission);

export const getAllPermission = getMany(Permission, {
  path: "staff",
  model: "Staff",
});

export const getOnePermission = getById(Permission);

export const updatePermission = deleteMany(Permission);

export const deletePermission = deleteOne(Permission);
