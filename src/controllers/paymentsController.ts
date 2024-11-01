import { Request, Response, NextFunction } from "express";
import Payment from "../models/PaymentModel";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";

// @dec
export const createPayment = createOne(Payment);

export const getPayments = getMany(Payment);

export const getPaymentById = getById(Payment);

export const updatePayment = update(Payment);

export const deletePayment = deleteOne(Payment);

export const deletePayments = deleteMany(Payment);
