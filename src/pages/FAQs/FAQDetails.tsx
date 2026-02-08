import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import FAQFormModal from "./FAQFormModal";
import { formatDate } from "../../utils/formatters";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import {
  useDeleteFaqMutation,
  useGetFaqsQuery,
} from "../../store/faqs/faqsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { FAQ } from "../../types";

const FAQDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const productName =
    (location.state as { productName?: string } | null)?.productName || null;

  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFAQToDelete] = useState<string | null>(null);
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const {
    data: faqsData,
    isLoading: isFaqsLoading,
    refetch: refetchFaqs,
  } = useGetFaqsQuery(productId ?? skipToken);

  type ApiFaq = {
    _id: string;
    productId: string;
    question: string;
    answer: string;
    createdAt: string;
  };

  const faqs = useMemo<FAQ[]>(() => {
    return (faqsData?.items || []).map((faq: ApiFaq) => ({
      _id: faq._id,
      productId: faq.productId,
      question: faq.question,
      answer: faq.answer,
      createdAt: faq.createdAt,
    }));
  }, [faqsData]);

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsFAQModalOpen(true);
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;
    try {
      await deleteFaq(faqToDelete).unwrap();
      toast.success("FAQ deleted successfully");
      setDeleteModalOpen(false);
      setFAQToDelete(null);
      refetchFaqs();
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  const confirmDelete = (faqId: string) => {
    setFAQToDelete(faqId);
    setDeleteModalOpen(true);
  };

  if (!productId) {
    return (
      <div className="space-y-4">
        <p className="text-gray-500 dark:text-gray-400">
          Product ID is missing.
        </p>
        <Button variant="secondary" onClick={() => navigate("/faqs")}>
          Back to FAQs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            FAQ Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Product: {productName || productId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/faqs")}>
            Back
          </Button>
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
      </div>

      <Card>
        {isFaqsLoading ? (
          <div className="mt-4">
            <TableSkeleton rows={6} columns={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
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
                {faqs.length > 0 ? (
                  faqs.map((faq) => (
                    <tr key={faq._id} className="table-row">
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No FAQs found for this product.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        productId={productId}
        productName={productName}
        onSuccess={() => {
          setIsFAQModalOpen(false);
          setSelectedFAQ(null);
          refetchFaqs();
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

export default FAQDetails;
