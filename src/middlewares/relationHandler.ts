import mongoose, {  Model as MongooseModel } from "mongoose";
import User from "../models/UserModel";
import { ApiError } from "../../utils/APIError";

// Define a type for related models to be used with Mongoose
interface IModelRelations {
  [key: string]: Array<{
    relationField: string;
    relatedModel: string;
    parentRelatedModel?: string;
    parentField?: string;
  }>;
}

// Define model relations configuration
const modelRelations: IModelRelations = {
  User: [
    { relationField: "userId", relatedModel: "Consultant", parentField: "" },
    { relationField: "userId", relatedModel: "Transaction", parentField: "" },
    { relationField: "userId", relatedModel: "Ticket", parentField: "" },
    { relationField: "userId", relatedModel: "Booking", parentField: "" },
    { relationField: "userId", relatedModel: "Wallet", parentField: "" },
  ],
  Consultant: [
    {
      relationField: "consultantId",
      relatedModel: "Availability",
      parentField: "",
    },
    { relationField: "consultantId", relatedModel: "Wallet", parentField: "" },
    { relationField: "consultantId", relatedModel: "Booking", parentField: "" },
  ],
  Availability: [],
  ConsultantProfile: [],
  ConsultantReview: [],
  ConsultantReviewComment: [],

  Permission: [],
  Staff: [],
  Wallet: [],
  Booking: [],
  Ticket: [],
  Transaction: [],
};

// Define a function to delete model relations dynamically
async function deleteModelRelations(
  modelName: string,
  modelId: mongoose.Types.ObjectId
): Promise<void> {
  const relations = modelRelations[modelName];
  console.log(relations);
  if (!relations) {
    console.log(`No relations found for model: ${modelName}`);
    return;
  }

  for (const relation of relations) {
    console.log(relation);
    if (!relations.hasOwnProperty(relation.relationField)) {
      console.log(`No relation field found for relation: ${relation.relationField}`);
      continue;
    }
    // Specify the schema's type for the related model
    const RelatedModel = mongoose.model<Document>(relation.relatedModel);

    console.log(
      `Deleting related documents for model: ${modelName} with ID: ${modelId}`
    );
    // Delete documents related to the given model ID
    await RelatedModel.deleteMany({ [relation.relationField]: modelId });
  }

  console.log(
    `All related documents deleted for model: ${modelName} with ID: ${modelId}`
  );
}

// دالة لحذف العلاقات بناءً على معرفات الوثائق
async function deleteManyModelRelations(
  modelName: string,
  modelIds: mongoose.Types.ObjectId[]
): Promise<void> {
  const relations = modelRelations[modelName];
  if (!relations) {
    console.log(`No relations found for model: ${modelName}`);
    return;
  }

  for (const relation of relations) {
    // الحصول على النموذج المرتبط باستخدام اسم النموذج
    const RelatedModel = mongoose.model(relation.relatedModel);

    // حذف الوثائق المرتبطة بكل معرف من القائمة
    await RelatedModel.deleteMany({
      [relation.relationField]: { $in: modelIds },
    });
  }

  console.log(
    `All related documents deleted for model: ${modelName} with IDs: ${modelIds}`
  );
}

// دالة لتحديث الدور بناءً على العملية
const updateRoleBasedOnModel = async (
  body: any,
  modelName: string,
  action: "create" | "delete" // إضافة نوع للعملية
) => {
  let id: mongoose.Types.ObjectId | undefined;
  if (body.userId) {
    id = body.userId;
  } else {
    id = new mongoose.Types.ObjectId(body.id);
  }

  if (id) {
    let user;

    if (modelName === "Consultant") {
      user = await User.findById(id);
    }

    if (user) {
      // تغيير الدور بناءً على العملية
      if (action === "create" && modelName === "Consultant") {
        user.role = "Consultant"; // تعيينه كمستشار عند الإنشاء
        console.log("create", user);
      } else if (action === "delete" && modelName === "Consultant") {
        user.role = "Customer"; // تعيينه كعميل عند الحذف
        console.log("delete", user);
      }
      await user.save();
    }
  }
};


const updateSchedule = async (
  Model: MongooseModel<any>,
  _id: string,
  scheduleData: {
    day: string;
    times: { startTime: string; endTime: string; _id: string }[];
    _id: string;
  }[]
) => {
  for (const update of scheduleData) {
    const { day, times, _id: dayId } = update;

    // تحقق مما إذا كان اليوم موجودًا
    const existingDay = await Model.findOne({
      _id: _id,
      "schedule._id": dayId,
    });

    if (!existingDay) {
      throw new ApiError(
        `No schedule found for the day with ID: ${dayId}`,
        404
      );
    }

    // تحديث اليوم
    let document = await Model.findOneAndUpdate(
      {
        _id: _id,
        "schedule._id": dayId,
      },
      {
        $set: { "schedule.$.day": day },
      },
      { new: true }
    );

    if (!document) {
      throw new ApiError(
        `No schedule found for the day with ID: ${dayId}`,
        404
      );
    }

    // تحديث الأوقات اذا توفرت
    if (!times) {
      return document;
    }

    for (const time of times) {
      const timeId = time._id;

      // تحقق مما إذا كان الوقت موجودًا
      const existingTime = await Model.findOne({
        _id: _id,
        "schedule.times._id": new mongoose.Types.ObjectId(timeId),
      });

      if (!existingTime) {
        throw new ApiError(
          `No time found for the time with ID: ${timeId}`,
          404
        );
      }

      // تحقق من تعارض الأوقات
      const hasConflict = existingDay.schedule[0].times.some((t: any) => {
        const tStart = t.startTime;
        const tEnd = t.endTime;
        const newStart = time.startTime;
        const newEnd = time.endTime;

        // تحقق من أن الوقت الجديد لا يتداخل مع الأوقات الموجودة
        return (
          (newStart >= tStart && newStart < tEnd) || // يبدأ الوقت الجديد أثناء وقت موجود
          (newEnd > tStart && newEnd <= tEnd) || // ينتهي الوقت الجديد أثناء وقت موجود
          (newStart <= tStart && newEnd >= tEnd) // يغطي الوقت الجديد الوقت الموجود بالكامل
        );
      });

      if (hasConflict) {
        throw new ApiError(
          `Time conflict detected for the time with ID: ${timeId}`,
          409 // رمز الحالة للتعارض
        );
      }

      // تحديث الوقت
      document = await Model.findOneAndUpdate(
        {
          _id: _id,
          "schedule._id": dayId,
          "schedule.times._id": timeId,
        },
        {
          $set: {
            "schedule.$.times.$[time]": {
              startTime: time.startTime,
              endTime: time.endTime,
            },
          },
        },
        {
          new: true,
          arrayFilters: [{ "time._id": new mongoose.Types.ObjectId(timeId) }],
        }
      );
      return document
    }
  }
  console.log("Schedule updated successfully");
};



const deleteFromSchedule = async (
  Model: MongooseModel<any>,
  id: string,
  scheduleUpdates: any
) => {
  for (const update of scheduleUpdates) {
    // تحقق مما إذا كان الحذف لليوم بالكامل أو لوقت معين فقط
    if (update._id && !update.timeId) {
      // حذف اليوم بالكامل بناءً على معرف اليوم
      await Model.findOneAndUpdate(
        { consultantId: id },
        { $pull: { schedule: { _id: update._id } } },
        { new: true }
      );
    } else if (update._id && update.timeId) {
      // حذف وقت معين من داخل اليوم بناءً على معرف اليوم ومعرف الوقت
      await Model.findOneAndUpdate(
        { _id: id, "schedule._id": update._id },
        { $pull: { "schedule.$.times": { _id: update.timeId } } },
        { new: true }
      );
    } else {
      throw new ApiError("Both _id and/or timeId must be provided.", 400);
    }
  }
};


// const updateRelatedModels = async (document: any, modelName: string) => {
//   try {
//     const relations = modelRelations[modelName];
//     if (!relations) {
//       console.error(`No relations defined for model: ${modelName}`);
//       return;
//     }
//     console.log(relations);

//     for (const relation of relations) {
//       if (relation.parentField && relation.parentField) {
//         // الحصول على النموذج المرتبط
//         const RelatedModel = mongoose.model(relation.relatedModel);
//         // البحث عن الوثائق المرتبطة باستخدام parentField
//         const relatedDocument = await RelatedModel.findOne({
//           _id: document[relation.relationField].toString(),
//         });

//         console.log(relatedDocument);

//         // تحديث الوثائق المرتبطة
//         if (relation.parentField) {
//           await RelatedModel.findByIdAndUpdate(relatedDocument._id, {
//             $push: { [relation.parentField]: document._id },
//           });
//         }
//       }
//     }
//   } catch (error: any) {
//     console.error(`Error in updating related models: ${error.message}`);
//     throw new Error(error?.message);
//   }
// };

export {
  deleteModelRelations,
  updateSchedule,
  deleteFromSchedule,
  // updateRelatedModels,
  updateRoleBasedOnModel,
  deleteManyModelRelations,
};
