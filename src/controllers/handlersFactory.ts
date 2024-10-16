import { NextFunction, Request, Response } from "express";
import { Model as MongooseModel } from "mongoose";
import asyncHandler from "express-async-handler";
import { ApiError } from "../../utils/APIError";

const createOne = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const document = await Model.create(req.body);

    res.status(201).json(document);
  });

const getMany = (Model: MongooseModel<any>) =>
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
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(
        new ApiError(`No document found with this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ message: "Document deleted successfully" });
  });

const deleteMany = (Model: MongooseModel<any>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const documents = await Model.deleteMany();

    // if (!documents) {
    //   return next(new ApiError("Documents not found", 404));
    // }
    res.status(200).json({ message: "Documents deleted successfully" });
  });

export { createOne, getMany, getById, update, deleteOne, deleteMany };
