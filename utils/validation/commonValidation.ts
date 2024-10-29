import { Model as MongooseModel } from 'mongoose';
import { formatTimeToHHmm, toMinutes } from '../timeHelper';

export const timeRegex = /^(?:[01]\d|2[0-3]):[0-5][0-9]$/; // time format "HH:mm"

export const validateExists = async (Model: MongooseModel<any>, id: string) => {
  if (!(await Model.exists({ _id: id }))) throw new Error();
  return true;
};

export const validateAllowedKeys = (value: Object, allowedKeys: string[]) => {
  const bodyKeys = Object.keys(value);
  const hasExtraKeys = bodyKeys.some(key => !allowedKeys.includes(key));
  return hasExtraKeys;
};

export const isDateInFuture = (date: string) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const inputDate = new Date(date).setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const isTimeInFuture = (time: string) => {
  if (RegExp(timeRegex).test(time) === false) return true;
  const today = toMinutes(formatTimeToHHmm(new Date()));
  const inputTime = toMinutes(time);
  return inputTime >= today;
};
