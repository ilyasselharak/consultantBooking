

import Review from "../models/ReviewModel";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";

// @desc    Create Review
// @route   POST /api/v1/Reviews
// @access  Private
const createReview = createOne(Review);

// @desc    Get Reviews
// @route   GET /api/v1/Reviews
// @access  Private
const getReviews = getMany(Review, {
  path: "consultantId userId",
  model: "Consultant User",
});

// @desc    Get Review
// @route   GET /api/v1/Reviews/:id
// @access  Private
const getReviewById = getById(Review);

// @desc    Update Review
// @route   PUT /api/v1/Reviews/:id
// @access  Private
const updateReview = update(Review);

// @desc    Delete Review
// @route   DELETE /api/v1/Reviews/:id
// @access  Private
const deleteReview = deleteOne(Review);

// @desc    Delete many Reviews
// @route   DELETE /api/v1/Reviews
// @access  Private
const deleteManyReviews = deleteMany(Review);

export {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  deleteManyReviews,
};
