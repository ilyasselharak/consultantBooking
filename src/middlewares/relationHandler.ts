import mongoose, { Document, Model } from "mongoose";

// Define a type for related models to be used with Mongoose
interface IModelRelations {
  [modelName: string]: {
    relationField: string;
    relatedModel: string;
  }[];
}

// Define model relations configuration
const modelRelations: IModelRelations = {
  Consultant: [
    { relationField: "consultantId", relatedModel: "Availability" },
    { relationField: "consultantId", relatedModel: "AvailabilityDays" },
    { relationField: "consultantId", relatedModel: "AvailabilityTimes" },
    { relationField: "consultantId", relatedModel: "Wallet" },
  ],
  // Add more models as needed
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



export default deleteModelRelations