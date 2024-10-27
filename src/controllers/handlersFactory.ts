import { NextFunction, Request, Response } from "express";
import mongoose, { Model as MongooseModel } from "mongoose";
import asyncHandler from "express-async-handler";
import { ApiError } from "../../utils/APIError";
import Availability from "../models/AvailabilityModel";
import AvailabilityDays from "../models/AvailabilityDaysModel";
import { deleteModelRelations, deleteManyModelRelations, updateRoleBasedOnModel } from "../middlewares/relationHandler";

const createOne = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    if (req.originalUrl.split("/").includes("availabilityDays")) {
      const document = await Model.create(req.body);
      await Availability.findByIdAndUpdate(req.body.availabilityId, {
        $push: { availabilityDays: document._id },
      });
      res.status(201).json(document);
    } else if (req.originalUrl.split("/").includes("availabilityTimes")) {
      const document = await Model.create(req.body);
      await AvailabilityDays.findByIdAndUpdate(req.body.availabilityDaysId, {
        $push: { availabilityTimes: document._id },
      });
      res.status(201).json(document);
    } else {
      console.log("document else", req.body);
      const document = await Model.create(req.body);
      updateRoleBasedOnModel(req.body, Model.modelName);
      res.status(201).json(document);
    }
  });

const getMany = (Model: MongooseModel<any>, fields = {}) =>
  asyncHandler(async (req: Request, res: Response) => {
    const documents = await Model.find();
    res.status(200).json(documents);
  });

const getById = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(
        new ApiError(`No document found with this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json(document);
  });

const update = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document found with this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json(document);
  });

const deleteOne = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    await deleteModelRelations(
      Model?.modelName,
      new mongoose.Types.ObjectId(req.params.id)
    );
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(
        new ApiError(`No document found with this id ${req.params.id}`, 404)
      );
    }

    updateRoleBasedOnModel(req.body, Model.modelName);
    res.status(200).json({ message: "Document deleted successfully" });
  });

const deleteMany = (Model: MongooseModel<any>) =>
  asyncHandler(async (req, res, next) => {
    // جلب جميع معرفات الوثائق
    const documents = await Model.find();
    const documentIds = documents.map((doc) => doc._id);

    // حذف الوثائق المرتبطة
    await deleteManyModelRelations(Model.modelName, documentIds);

    // حذف الوثائق من النموذج الرئيسي
    await Model.deleteMany();

    res
      .status(200)
      .json({ message: "Documents and their relations deleted successfully" });
  });



export { createOne, getMany, getById, update, deleteOne, deleteMany };
