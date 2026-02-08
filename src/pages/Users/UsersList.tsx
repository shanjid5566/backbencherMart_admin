import { useMemo, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import UserFormModal from "./UserFormModal";
import { User } from "../../types";
import { formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../store/users/usersApi";

const UsersList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const { data, isLoading, refetch } = useGetUsersQuery({
    page,
    limit: 20,
    search: search || undefined,
    role: roleFilter || undefined,
    status: verifiedFilter || undefined,
  });

  const pageSize = data?.pagination?.limit ?? 20;
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.pages ?? 1;

  const apiUsers = useMemo(() => {
    return (data?.users || []).map((user) => ({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    }));
  }, [data]);

  const currentPage = Math.min(page, totalPages);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete).unwrap();
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setUserToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setIsUserModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Roles" },
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
            ]}
          />
          <Select
            value={verifiedFilter}
            onChange={(e) => {
              setVerifiedFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Status" },
              { value: "true", label: "Verified" },
              { value: "false", label: "Unverified" },
            ]}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Joined
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiUsers.map((user) => (
                  <tr key={user._id} className="table-row">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                            {user.firstName[0]}
                            {user.lastName?.[0] || ""}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.isVerified ? "success" : "warning"}>
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(user._id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, total)} of {total} users
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={() => {
          refetch();
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this user? This action cannot be
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

export default UsersList;
