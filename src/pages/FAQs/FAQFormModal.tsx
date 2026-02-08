import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../../components/ui/Modal";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { FAQ } from "../../types";
import toast from "react-hot-toast";
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
} from "../../store/faqs/faqsApi";

const faqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
});

type FAQInputs = z.infer<typeof faqSchema>;

interface FAQFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: FAQ | null;
  productId: string | null;
  productName?: string | null;
  onSuccess: () => void;
}

const FAQFormModal = ({
  isOpen,
  onClose,
  faq,
  productId,
  productName,
  onSuccess,
}: FAQFormModalProps) => {
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FAQInputs>({
    resolver: zodResolver(faqSchema),
    defaultValues: faq
      ? {
          question: faq.question,
          answer: faq.answer,
        }
      : undefined,
  });

  useEffect(() => {
    if (faq) {
      reset({ question: faq.question, answer: faq.answer });
    } else {
      reset({ question: "", answer: "" });
    }
  }, [faq, reset]);

  const onSubmit = async (data: FAQInputs) => {
    try {
      if (faq) {
        await updateFaq({ faqId: faq._id, ...data }).unwrap();
        toast.success("FAQ updated successfully");
      } else {
        if (!productId) {
          toast.error("Select a product before adding a FAQ");
          return;
        }
        await createFaq({ productId, ...data }).unwrap();
        toast.success("FAQ created successfully");
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save FAQ");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isSaving = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={faq ? "Edit FAQ" : "Create FAQ"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!faq && productName && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Product: {productName}
          </p>
        )}

        <Textarea
          label="Question"
          placeholder="Enter the question"
          rows={3}
          error={errors.question?.message}
          {...register("question")}
        />

        <Textarea
          label="Answer"
          placeholder="Enter the answer"
          rows={5}
          error={errors.answer?.message}
          {...register("answer")}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {faq ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FAQFormModal;
