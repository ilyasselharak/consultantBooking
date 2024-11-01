import { NextFunction, Request, Response } from "express";
import mongoose, { Model as MongooseModel } from "mongoose";
import asyncHandler from "express-async-handler";
import { ApiError } from "../../utils/APIError";
import {
  deleteModelRelations,
  deleteManyModelRelations,
  updateRoleBasedOnModel,
  updateSchedule,
  deleteFromSchedule,
  // updateRelatedModels,
} from "../middlewares/relationHandler";

// get specific relations
const getSpecificOne = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    console.log("req.params", req.params);
    const document = await Model.findOne(req.params);
    if (!document) {
      throw new ApiError("Document not found", 404);
    }
    res.status(200).json(document);
  });

const createOne = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response) => {

    // if (req.originalUrl.split("/").includes("availabilityDays")) {
    //   const document = await Model.create(req.body);
    //   await Availability.findByIdAndUpdate(req.body.availabilityId, {
    //     $push: { availabilityDays: document._id },
    //   });
    //   res.status(201).json(document);
    // } else if (req.originalUrl.split("/").includes("availabilityTimes")) {
    //   const document = await Model.create(req.body);
    //   await AvailabilityDays.findByIdAndUpdate(req.body.availabilityDaysId, {
    //     $push: { availabilityTimes: document._id },
    //   });
    //   res.status(201).json(document);
    // } else {
    const document = await Model.create(req.body);

    // updateRelatedModels(document, Model.modelName);
    // updateRoleBasedOnModel(req.body, Model.modelName, "create");
    res.status(201).json(document);
    // }
  });

interface PopulatePath {
  path: string;
}

interface PopulateOptions {
  path: string;
  select?: string | string[];
  model: string;
  populate?: PopulateOptions;
}[];


// جعل `populate` اختيارياً في الدالة
const getMany = (Model: MongooseModel<any>, populate?: PopulateOptions) =>
  asyncHandler(async (req: Request, res: Response) => {
    // Fetch IP from headers or connection
    const ipList =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    // Convert to string if it's an array
    const ipString = Array.isArray(ipList) ? ipList.join(",") : ipList;

    // Regular expression to match IPv4 address format
    const ipv4Regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    const match = ipString.match(ipv4Regex);

    // If a match is found, send the IP, otherwise indicate not found
    const ipv4 = match ? match[0] : "IP not found";
    console.log("IP:", ipv4);
    // التحقق مما إذا كانت `populate` موجودة
    const query = Model.find();
    if (populate) {
      query.populate(populate);
    }
    const documents = await query.exec();
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
    console.log(req.body);

    let document;
    if (req.body.schedule) {
      console.log("req.body.schedule", req.body.schedule);
      document = await updateSchedule(Model, req.params.id, req.body.schedule);
    } else {
      document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    }
    console.log("document", document);

    // if (!document) {
    //   return next(
    //     new ApiError(`No document found with this id ${req.params.id}`, 404)
    //   );
    // }
    res.status(200).json(document);
  });

const deleteOne = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    let document;
    if (req.body.schedule) {
      document = await deleteFromSchedule(Model, req.params.id, req.body.schedule);
    } else {

      await deleteModelRelations(
        Model?.modelName,
        new mongoose.Types.ObjectId(req.params.id)
      );
      document = await Model.findByIdAndDelete(req.params.id);
      
    }
    if (!document) {
      return next(
        new ApiError(`No document found with this id ${req.params.id}`, 404)
      );
    }
    if (document.userId) {
      updateRoleBasedOnModel(document.userId, Model.modelName, "delete");
    }

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

export {
  getSpecificOne,
  createOne,
  getMany,
  getById,
  update,
  deleteOne,
  deleteMany,
};
