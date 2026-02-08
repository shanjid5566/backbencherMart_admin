import { useParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../store/api/adminApi";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { CardSkeleton } from "../../components/ui/LoadingSkeleton";
import { formatCurrency, formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";
import { useState } from "react";

const OrderDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [newStatus, setNewStatus] = useState("");

  const handleStatusUpdate = async () => {
    if (!newStatus || !id) return;

    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success("Order status updated successfully");
      setNewStatus("");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!data) {
    return <div>Order not found</div>;
  }

  const order = data;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Order #{order._id.slice(-8)}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Placed on {formatDate(order.createdAt, "long")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Order Status">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Current Status
              </p>
              <Badge variant="info" className="text-base px-4 py-2">
                {order.status}
              </Badge>
            </div>
            <div>
              <Select
                label="Update Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: "created", label: "Created" },
                  { value: "processing", label: "Processing" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "refunded", label: "Refunded" },
                ]}
              />
              <Button
                onClick={handleStatusUpdate}
                isLoading={isUpdating}
                disabled={!newStatus}
                className="mt-3 w-full"
              >
                Update Status
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Customer Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {typeof order.user === "object" ? order.user.email : order.user}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Shipping Address
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {order.shippingAddress.street}, {order.shippingAddress.city}
                <br />
                {order.shippingAddress.state},{" "}
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Order Items">
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {typeof item.product === "object"
                      ? item.product.name
                      : "Product"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatCurrency(order.subTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatCurrency(order.tax)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-gray-100">Total</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
