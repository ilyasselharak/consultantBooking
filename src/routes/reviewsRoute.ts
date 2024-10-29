import express from "express";
import {
  createReview,
  deleteManyReviews,
  deleteReview,
  getReviewById,
  getReviews,
  updateReview,
} from "../controllers/reviewsController";

const router = express.Router();

router.route("/").post(createReview).get(getReviews).delete(deleteManyReviews);
router.route("/:id").get(getReviewById).put(updateReview).delete(deleteReview);

export default router;
