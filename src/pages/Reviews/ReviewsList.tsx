import { useState } from "react";
import { Trash2, Star } from "lucide-react";
import {
  useGetReviewsQuery,
  useDeleteReviewMutation,
} from "../../store/api/adminApi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";

const ReviewsList = () => {
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetReviewsQuery({
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await deleteReview(reviewToDelete).unwrap();
      toast.success("Review deleted successfully");
      setDeleteModalOpen(false);
      setReviewToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const confirmDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteModalOpen(true);
  };

  const renderStars = (rating) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Reviews
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage product reviews and ratings
        </p>
      </div>

      <Card>
        {isLoading ? (
          <TableSkeleton rows={10} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product
                  </th>
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
                {data?.data.map((review) => (
                  <tr key={review._id} className="table-row">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {typeof review.product === "object"
                        ? review.product.name
                        : "Product"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {typeof review.user === "object"
                        ? review.user.email
                        : review.user}
                    </td>
                    <td className="py-3 px-4">{renderStars(review.rating)}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, data.total)}{" "}
              of {data.total} reviews
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === data.totalPages}
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

export default ReviewsList;
