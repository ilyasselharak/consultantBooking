import { body, param } from "express-validator";
import validatorMiddleware from "./../../src/middlewares/validationMiddleware";
import mongoose, { Types } from "mongoose";
import { validateExists } from "./commonValidation";
import Consultant from "../../src/models/ConsultantModel";
import Availability from "../../src/models/AvailabilityModel";
import moment from "moment";

const addDayOrTimesValidation = [
  body("schedule")
    .exists()
    .notEmpty()
    .withMessage("Schedule is required")
    .isArray({ min: 1 })
    .withMessage("Schedule must be an array")
    .custom(async (value) => {
      const currentDate = moment(); // الحصول على التاريخ الحالي

      for (const day of value) {
        // التحقق من وجود اليوم
        if (!day.day || !moment(day.day, "YYYY-MM-DD", true).isValid()) {
          throw new Error("Invalid day format. Use YYYY-MM-DD.");
        }

        // التحقق من عدم وجود تاريخ قبل اليوم الحالي
        if (moment(day.day).isBefore(currentDate, "day")) {
          throw new Error("The day cannot be in the past.");
        }

        // التحقق من أن times هي مصفوفة وأنها تحتوي على عناصر
        if (!Array.isArray(day.times) || day.times.length < 1) {
          throw new Error("Times must be an array and cannot be empty.");
        }

        // التحقق من كل وقت في الأوقات المحددة
        for (const time of day.times) {
          const startTime = moment(time.startTime, "HH:mm", true);
          const endTime = moment(time.endTime, "HH:mm", true);

          // التحقق من أن الوقتين صحيحين
          if (!startTime.isValid() || !endTime.isValid()) {
            throw new Error("Start time and end time must be in HH:mm format.");
          }

          // التحقق من عدم تعارض وقت البدء مع وقت الانتهاء
          if (startTime.isSameOrAfter(endTime)) {
            throw new Error("Start time must be before end time.");
          }

          // التحقق من مدة الوقت بين البدء والانتهاء
          const duration = moment.duration(endTime.diff(startTime)).asMinutes();
          if (duration < 10) {
            throw new Error(
              "Duration between start time and end time must be at least 10 minutes."
            );
          }
          if (duration > 1440) {
            // 1440 دقيقة = 24 ساعة
            throw new Error(
              "Duration between start time and end time cannot exceed 24 hours."
            );
          }

          // التحقق من عدم دخول الوقت في اليوم التالي
          const endOfDay = moment(day.day).endOf("day");
          if (endTime.isAfter(endOfDay)) {
            throw new Error("End time cannot be in the next day.");
          }
        }
      }
      return true; // إذا كانت جميع التحقق صحيحة
    }),
  validatorMiddleware,
];



const createAvailabilityValidation = [
  body("consultantId")
    .exists()
    .notEmpty()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .custom(async (value) => await validateExists(Consultant, value))

    .withMessage("Invalid consultant ID")
    .custom(async (value) => {
      const availability = await Availability.exists({ consultantId: value });
      if (availability) {
        throw new Error("This consultant already has an availability");
      }
      return true;
    }),
  body("schedule")
    .exists()
    .notEmpty()
    .withMessage("Schedule is required")
    .isArray({ min: 1 })
    .withMessage("Schedule must be an array")
    .custom(async (value) => {
      const currentDate = moment();

      for (const day of value) {
        // التحقق من عدم خلو اليوم أو الأوقات
        const hasDate = !!day.day;
        const hasTimes = Array.isArray(day.times) && day.times.length > 0;

        if (!hasDate && !hasTimes) {
          throw new Error("At least one of 'day' or 'times' must be provided.");
        }

        // التحقق من أن اليوم موجود وصالح إذا تم إدخال اليوم فقط
        if (hasDate && !hasTimes) {
          if (!moment(day.day, "YYYY-MM-DD", true).isValid()) {
            throw new Error("Invalid day format. Use YYYY-MM-DD.");
          }
          if (moment(day.day).isBefore(currentDate, "day")) {
            throw new Error("The day cannot be in the past.");
          }
        }

        // التحقق إذا كان الإدخال يحتوي على أوقات فقط بدون اليوم
        if (hasTimes && !hasDate) {
          if (!day._id) {
            throw new Error("If times are provided, day ID must be present.");
          }
        }

        // التحقق من الأوقات وإجراء الاختبارات
        for (const time of day.times) {
          const startTime = moment(time.startTime, "HH:mm", true);
          const endTime = moment(time.endTime, "HH:mm", true);

          if (!startTime.isValid() || !endTime.isValid()) {
            throw new Error("Start time and end time must be in HH:mm format.");
          }

          if (startTime.isSameOrAfter(endTime)) {
            throw new Error("Start time must be before end time.");
          }

          const duration = moment.duration(endTime.diff(startTime)).asMinutes();
          if (duration < 10) {
            throw new Error(
              "Duration between start time and end time must be at least 10 minutes."
            );
          }
          if (duration > 1440) {
            throw new Error(
              "Duration between start time and end time cannot exceed 24 hours."
            );
          }

          if (hasDate) {
            const endOfDay = moment(day.day).endOf("day");
            if (endTime.isAfter(endOfDay)) {
              throw new Error("End time cannot be in the next day.");
            }
          }
        }
      }
      return true;
    }),
  validatorMiddleware,
];

const getAvailabilityByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Availability, value)))
    .withMessage("Invalid availability ID"),
  validatorMiddleware,
];

// تعريف نوع للكائن المستخدم في الأيام
interface DaySchedule {
  _id: string;
  day: string;
  times: { startTime: string; endTime: string; _id: string }[]; // تأكد من أن الوقت يحتوي على _id
}

const updateAvailabilityValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Availability, value)))
    .withMessage("Invalid availability ID"),
  body("schedule")
    .exists()
    .notEmpty()
    .withMessage("Schedule is required")
    .isArray({ min: 1 })
    .withMessage("Schedule must be an array")
    .custom(async (value, { req }) => {
      const currentDate = moment(); // الحصول على التاريخ الحالي

      for (const day of value) {
        // التحقق من وجود معرف اليوم
        if (!day._id) {
          throw new Error("Day ID is required.");
        }

        // التحقق من أن اليوم موجود في النظام (يمكنك استبدال هذا بالتحقق الخاص بك)
        const existingDay = await Availability.findById(req?.params?.id); // تأكد من استبدال Availability بالنموذج المناسب
        if (!existingDay) {
          throw new Error(`No schedule found for the day with ID: ${req?.params?.id}`);
        }

        // شرط 1: التأكد من أن أحد الحقول ليس فارغًا
        const hasDate = !!day.day;
        const hasTimes = Array.isArray(day.times) && day.times.length > 0;

        if (!hasDate && !hasTimes) {
          throw new Error("At least one of 'day' or 'times' must be provided.");
        }

        // شرط 2: إذا كان هناك تاريخ بدون وقت
        if (hasDate && !hasTimes) {
          // هنا، تأكد من أن التاريخ صحيح
          if (!moment(day.day, "YYYY-MM-DD", true).isValid()) {
            throw new Error("Invalid day format. Use YYYY-MM-DD.");
          }

          // التحقق من عدم وجود تاريخ قبل اليوم الحالي
          if (moment(day.day).isBefore(currentDate, "day")) {
            throw new Error("The day cannot be in the past.");
          }
        }

        // شرط 3: إذا كان هناك وقت
        if (hasTimes) {
          // يجب التأكد من وجود معرف التاريخ
          if (!day._id) {
            throw new Error(
              "If times are provided, both date ID and time IDs must be present."
            );
          }

          // التحقق من أن times هي مصفوفة وأنها تحتوي على عناصر
          if (!Array.isArray(day.times) || day.times.length < 1) {
            throw new Error("Times must be an array and cannot be empty.");
          }

          // التحقق من كل وقت في الأوقات المحددة
          for (const time of day.times) {
            if (!time._id) {
              throw new Error("Time ID is required.");
            }

            const startTime = moment(time.startTime, "HH:mm", true);
            const endTime = moment(time.endTime, "HH:mm", true);

            // التحقق من أن الوقتين صحيحين
            if (!startTime.isValid() || !endTime.isValid()) {
              throw new Error(
                "Start time and end time must be in HH:mm format."
              );
            }

            // التحقق من عدم تعارض وقت البدء مع وقت الانتهاء
            if (startTime.isSameOrAfter(endTime)) {
              throw new Error("Start time must be before end time.");
            }

            // التحقق من مدة الوقت بين البدء والانتهاء
            const duration = moment
              .duration(endTime.diff(startTime))
              .asMinutes();
            if (duration < 10) {
              throw new Error(
                "Duration between start time and end time must be at least 10 minutes."
              );
            }
            if (duration > 1440) {
              // 1440 دقيقة = 24 ساعة
              throw new Error(
                "Duration between start time and end time cannot exceed 24 hours."
              );
            }

            // التحقق من عدم دخول الوقت في اليوم التالي
            const endOfDay = moment(day.day).endOf("day");
            if (endTime.isAfter(endOfDay)) {
              throw new Error("End time cannot be in the next day.");
            }
          }
        }
      }
      return true; // إذا كانت جميع التحقق صحيحة
    }),
  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be a boolean value"),

  validatorMiddleware,
];

const deleteScheduleValidation = [
  param("consultantId")
    .exists()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Consultant, value)))
    .withMessage("Invalid consultant ID"),
  body("scheduleUpdates")
    .exists()
    .withMessage("Schedule updates are required.")
    .isArray({ min: 1 })
    .withMessage("Schedule updates must be an array with at least one item.")
    .custom((value) => {
      console.log(value);
      for (const update of value) {
        // التحقق من dayId
        if (!update.dayId || !mongoose.Types.ObjectId.isValid(update.dayId)) {
          throw new Error("A valid dayId is required.");
        }

        // التحقق من timeId إذا كان موجودًا
        if (update.timeId && !mongoose.Types.ObjectId.isValid(update.timeId)) {
          throw new Error(
            "If provided, timeId must be a valid MongoDB ObjectId."
          );
        }
      }
          console.log(value);
      return true;
    }),

  validatorMiddleware,
];

const deleteAvailabilityByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Availability, value)))
    .withMessage("Invalid availability ID"),
  validatorMiddleware,
];

const deleteAvailabilitiesValidation = [
  body("ids")
    .exists()
    .notEmpty()
    .withMessage("Availability IDs are required")
    .isArray()
    .withMessage("Availability IDs must be an array")
    .custom(
      (value) => !!value.every((id: string) => Types.ObjectId.isValid(id))
    )
    .withMessage("Invalid availabilities IDs"),
  validatorMiddleware,
];

export {
  createAvailabilityValidation,
  getAvailabilityByIdValidation,
  updateAvailabilityValidation,
  addDayOrTimesValidation,
  deleteAvailabilityByIdValidation,
  deleteScheduleValidation,
  deleteAvailabilitiesValidation,
};
