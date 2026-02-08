import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { User } from "../../types";
import { useUpdateUserMutation } from "../../store/users/usersApi";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["admin", "staff", "customer"]),
  isVerified: z.boolean(),
});

type UserInputs = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSuccess: () => void;
}

const UserFormModal = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserFormModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName || "",
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        }
      : {
          isVerified: false,
          role: "customer",
        },
  });

  const onSubmit = async (data: UserInputs) => {
    setIsSaving(true);
    try {
      if (user) {
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateUser({ id: user._id, ...updateData }).unwrap();
        toast.success("User updated successfully");
      } else {
        toast.success("User created successfully");
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Failed to ${user ? "update" : "create"} user`);
    } finally {
      setIsSaving(false);
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
      title={user ? "Edit User" : "Create User"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName")}
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label={user ? "Password (leave blank to keep current)" : "Password"}
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Select
          label="Role"
          error={errors.role?.message}
          {...register("role")}
          options={[
            { value: "customer", label: "Customer" },
            { value: "admin", label: "Admin" },
          ]}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isVerified"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            {...register("isVerified")}
          />
          <label
            htmlFor="isVerified"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            Email Verified
          </label>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving || isUpdating}>
            {user ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
