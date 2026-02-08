import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  useGetDashboardMetricsQuery,
  useGetOrdersQuery,
} from "../../store/api/adminApi";
import MetricCard from "../../components/dashboard/MetricCard";
import SalesChart from "../../components/dashboard/SalesChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { CardSkeleton } from "../../components/ui/LoadingSkeleton";

const Dashboard = () => {
  const { data: metricsData, isLoading: metricsLoading } =
    useGetDashboardMetricsQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Mock low stock products
  const lowStockProducts = [
    { id: "1", name: "Classic White T-Shirt", stock: 5, minStock: 10 },
    { id: "2", name: "Denim Jeans", stock: 8, minStock: 10 },
    { id: "3", name: "Summer Dress", stock: 3, minStock: 10 },
  ];

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={metricsData?.totalUsers?.toLocaleString() || "0"}
          change={metricsData?.userGrowth || 0}
          icon={<Users className="w-6 h-6 text-primary-600" />}
        />
        <MetricCard
          title="Total Products"
          value={metricsData?.totalProducts?.toLocaleString() || "0"}
          change={metricsData?.productGrowth || 0}
          icon={<Package className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100 dark:bg-green-900/20"
        />
        <MetricCard
          title="Total Orders"
          value={metricsData?.totalOrders?.toLocaleString() || "0"}
          change={metricsData?.orderGrowth || 0}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metricsData?.totalRevenue?.toLocaleString() || "0"}`}
          change={metricsData?.revenueGrowth || 0}
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Low Stock Alert */}
        <Card
          title="Low Stock Alert"
          subtitle={`${lowStockProducts.length} products`}
          action={<AlertTriangle className="w-5 h-5 text-yellow-600" />}
        >
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Min: {product.minStock} units
                  </p>
                </div>
                <Badge variant="warning">{product.stock} left</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={ordersData?.data} isLoading={ordersLoading} />
    </div>
  );
};

export default Dashboard;
