
import mongoose, { Document, Model } from "mongoose";
import User from "../models/UserModel";

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
  Availability: [
    {
      relationField: "availabilityId",
      relatedModel: "AvailabilityDays",
      parentRelatedModel: "Consultant",

      parentField: "",
    },
  ],
  AvailabilityDays: [
    {
      relationField: "availabilityDaysId",
      relatedModel: "AvailabilityTimes",
      parentRelatedModel: "Availability",
      parentField: "availabilityDays",
    },
  ],
  AvailabilityTimes: [
    {
      relationField: "",
      relatedModel: "",
      parentRelatedModel: "AvailabilityDays",
      parentField: "availabilityTimes",
    },
  ],
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
  if (!relations) {
    console.log(`No relations found for model: ${modelName}`);
    return;
  }

  for (const relation of relations) {
    // Specify the schema's type for the related model
    const RelatedModel = mongoose.model<Document>(relation.relatedModel);

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
        console.log("create",user);
      } else if (action === "delete" && modelName === "Consultant") {

        user.role = "Customer"; // تعيينه كعميل عند الحذف
        console.log("delete",user);
      }
      await user.save();
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
  // updateRelatedModels,
  updateRoleBasedOnModel,
  deleteManyModelRelations,
};
