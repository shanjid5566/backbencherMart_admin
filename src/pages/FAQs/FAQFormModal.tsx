import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateFAQMutation,
  useUpdateFAQMutation,
} from "../../store/api/adminApi";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { FAQ } from "../../types";
import toast from "react-hot-toast";

const faqSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
});

type FAQInputs = z.infer<typeof faqSchema>;

interface FAQFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: FAQ | null;
  onSuccess: () => void;
}

const FAQFormModal = ({
  isOpen,
  onClose,
  faq,
  onSuccess,
}: FAQFormModalProps) => {
  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FAQInputs>({
    resolver: zodResolver(faqSchema),
    defaultValues: faq
      ? {
          productId: faq.productId,
          question: faq.question,
          answer: faq.answer,
        }
      : undefined,
  });

  const onSubmit = async (data: FAQInputs) => {
    try {
      if (faq) {
        await updateFAQ({ id: faq._id, ...data }).unwrap();
        toast.success("FAQ updated successfully");
      } else {
        await createFAQ(data).unwrap();
        toast.success("FAQ created successfully");
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Failed to ${faq ? "update" : "create"} FAQ`);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={faq ? "Edit FAQ" : "Create FAQ"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Product ID"
          placeholder="Enter product ID"
          error={errors.productId?.message}
          {...register("productId")}
        />

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
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isCreating || isUpdating}>
            {faq ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FAQFormModal;
