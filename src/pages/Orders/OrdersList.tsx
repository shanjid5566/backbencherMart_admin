import { ChangeEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../store/orders/ordersApi";

const OrdersList = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading, refetch } = useGetOrdersQuery({
    page,
    limit: 20,
    status: statusFilter || undefined,
  });
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const pageSize = data?.pagination?.limit ?? 20;
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.pages ?? 1;

  type ApiOrder = {
    id: string;
    orderId?: string;
    customer?: string;
    customerEmail?: string;
    date: string;
    total: number;
    status: string;
  };

  const orders = useMemo(() => {
    return (data?.orders || []).map((order: ApiOrder) => ({
      _id: order.id,
      orderId: order.orderId,
      customer: order.customer,
      customerEmail: order.customerEmail,
      createdAt: order.date,
      total: order.total,
      status: order.status,
    }));
  }, [data]);

  const filteredOrders = orders;
  const currentPage = Math.min(page, totalPages);
  const pagedOrders = filteredOrders;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "processing":
        return "info";
      case "cancelled":
        return "danger";
      case "shipped":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Orders
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage customer orders and shipments
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={statusFilter}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Status" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => (
                  <tr key={order._id} className="table-row">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      #{order.orderId || order._id.slice(-6)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {order.customerEmail || order.customer}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onChange={async (event: ChangeEvent<HTMLSelectElement>) => {
                            try {
                              await updateOrderStatus({
                                orderId: order._id,
                                status: event.target.value,
                              }).unwrap();
                              toast.success("Status updated");
                              refetch();
                            } catch (error) {
                              toast.error("Failed to update status");
                            }
                          }}
                          options={[
                            { value: "processing", label: "processing" },
                            { value: "shipped", label: "shipped" },
                            { value: "delivered", label: "delivered" },
                            { value: "cancelled", label: "cancelled" },
                          ]}
                        />
                        <Link to={`/orders/${order._id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isUpdating}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, total)} of {total} orders
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
    </div>
  );
};

export default OrdersList;
