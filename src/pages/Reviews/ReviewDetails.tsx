import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";
import {
  useDeleteReviewMutation,
  useGetReviewsQuery,
} from "../../store/reviews/reviewsApi";
import { skipToken } from "@reduxjs/toolkit/query";

const ReviewDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const productName =
    (location.state as { productName?: string } | null)?.productName || null;

  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    refetch: refetchReviews,
  } = useGetReviewsQuery(
    productId
      ? {
          page,
          limit: 20,
          productId,
        }
      : skipToken,
  );

  type ApiReview = {
    _id: string;
    productId: string;
    userEmail?: string;
    userName?: string;
    rating: number;
    comment: string;
    createdAt: string;
  };

  const reviews = useMemo(() => {
    return (reviewsData?.items || []).map((review: ApiReview) => ({
      _id: review._id,
      productId: review.productId,
      userEmail: review.userEmail,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));
  }, [reviewsData]);

  const reviewsTotal = reviewsData?.meta?.totalItems ?? 0;
  const reviewsTotalPages = reviewsData?.meta?.totalPages ?? 1;
  const reviewsPageSize = reviewsData?.meta?.limit ?? 20;
  const currentReviewPage = Math.min(page, reviewsTotalPages);

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview(reviewToDelete).unwrap();
      toast.success("Review deleted successfully");
      setDeleteModalOpen(false);
      setReviewToDelete(null);
      refetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const confirmDelete = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  if (!productId) {
    return (
      <div className="space-y-4">
        <p className="text-gray-500 dark:text-gray-400">
          Product ID is missing.
        </p>
        <Button variant="secondary" onClick={() => navigate("/reviews")}>
          Back to Reviews
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Review Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Product: {productName || productId}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/reviews")}>
          Back
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Reviews
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Product reviews and ratings
            </p>
          </div>
          {reviewsData?.summary && (
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Reviews: {reviewsData.summary.totalReviews}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg Rating: {reviewsData.summary.averageRatings}
              </p>
            </div>
          )}
        </div>

        {isReviewsLoading ? (
          <div className="mt-4">
            <TableSkeleton rows={6} columns={5} />
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rating
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Comment
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <tr key={review._id} className="table-row">
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {review.userEmail || review.userName}
                      </td>
                      <td className="py-3 px-4">
                        {renderStars(review.rating)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                        {review.comment}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(review._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No reviews found for this product.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {reviewsTotalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentReviewPage - 1) * reviewsPageSize + 1} to{" "}
              {Math.min(currentReviewPage * reviewsPageSize, reviewsTotal)} of{" "}
              {reviewsTotal} reviews
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(currentReviewPage - 1)}
                disabled={currentReviewPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(currentReviewPage + 1)}
                disabled={currentReviewPage === reviewsTotalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Review"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReviewDetails;
