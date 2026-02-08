import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  useGetFAQsQuery,
  useDeleteFAQMutation,
} from "../../store/api/adminApi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import FAQFormModal from "./FAQFormModal";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import { FAQ } from "../../types";
import { formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";

const FAQsList = () => {
  const [page, setPage] = useState(1);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFAQToDelete] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetFAQsQuery({
    page,
    limit: 10,
  });

  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  const handleEdit = (faq) => {
    setSelectedFAQ(faq);
    setIsFAQModalOpen(true);
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;

    try {
      await deleteFAQ(faqToDelete).unwrap();
      toast.success("FAQ deleted successfully");
      setDeleteModalOpen(false);
      setFAQToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  const confirmDelete = (faqId) => {
    setFAQToDelete(faqId);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            FAQs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedFAQ(null);
            setIsFAQModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <TableSkeleton rows={10} columns={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Question
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Answer
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
                {data?.data.map((faq) => (
                  <tr key={faq._id} className="table-row">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {typeof faq.product === "object"
                        ? faq.product.name
                        : "Product"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                      {faq.question}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                      {faq.answer}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(faq.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(faq)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(faq._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
              of {data.total} FAQs
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

      <FAQFormModal
        isOpen={isFAQModalOpen}
        onClose={() => {
          setIsFAQModalOpen(false);
          setSelectedFAQ(null);
        }}
        faq={selectedFAQ}
        onSuccess={() => {
          refetch();
          setIsFAQModalOpen(false);
          setSelectedFAQ(null);
        }}
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete FAQ"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this FAQ? This action cannot be
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

export default FAQsList;
