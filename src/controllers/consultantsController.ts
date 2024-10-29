import Consultant from "../models/ConsultantModel";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";

// @desc    Create consultant
// @route   POST /api/v1/consultants
// @access  Private
const createConsultant = () => {
  createOne(Consultant);
  
};

// @desc    Get consultants
// @route   GET /api/v1/consultants
// @access  Private
const getConsultants = getMany(Consultant, {
  path: "userId",
  model: "User",
});

// @desc    Get consultant
// @route   GET /api/v1/consultants/:id
// @access  Private
const getConsultantById = getById(Consultant);

// @desc    Update consultancy
// @route   PUT /api/v1/consultants/:id
// @access  Private
const updateConsultant = update(Consultant);

// @desc    Delete consultancy
// @route   DELETE /api/v1/consultants/:id
// @access  Private
const deleteConsultant = deleteOne(Consultant);

// @desc    Delete many consultants
// @route   DELETE /api/v1/consultants
// @access  Private
const deleteManyConsultants = deleteMany(Consultant);

export {
  createConsultant,
  getConsultants,
  getConsultantById,
  updateConsultant,
  deleteConsultant,
  deleteManyConsultants,
};
