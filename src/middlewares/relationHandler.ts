import Permission from "../models/PermissionModel"; 
import mongoose, { Document, Model } from "mongoose";
import User from "../models/UserModel";

// Define a type for related models to be used with Mongoose
interface IModelRelations {
  [modelName: string]: {
    relationField: string;
    relatedModel: string;
  }[];
}

// Define model relations configuration
const modelRelations: IModelRelations = {
  User: [
    { relationField: "userId", relatedModel: "Transaction" },
    { relationField: "userId", relatedModel: "Ticket" },
    { relationField: "userId", relatedModel: "Booking" },
  ],
  Consultant: [
    { relationField: "consultantId", relatedModel: "Availability" },
    { relationField: "consultantId", relatedModel: "Wallet" },
    { relationField: "consultantId", relatedModel: "Booking" },
  ],
  Availability: [
    { relationField: "availabilityId", relatedModel: "AvailabilityDays" },
  ],
  AvailabilityDays: [
    { relationField: "availabilityDaysId", relatedModel: "AvailabilityTimes" },
  ],
  Wallet: [{ relationField: "consultantId", relatedModel: "Transaction" }],
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



const updateRoleBasedOnModel = async (
  body: any,
  modelName: string
) => {
  if (modelName === "User") {
    const user = await User.findById(body.userId);
    if (user) {
      user.role = body.role;
      await user.save();
    }
  }
};

export {
  deleteModelRelations,
  updateRoleBasedOnModel,
  deleteManyModelRelations,
};
