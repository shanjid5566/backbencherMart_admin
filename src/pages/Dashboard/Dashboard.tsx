import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import MetricCard from "../../components/dashboard/MetricCard";
import SalesChart from "../../components/dashboard/SalesChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const Dashboard = () => {
  const metricsNormalized = {
    totalUsers: 8,
    userGrowth: 300,
    totalProducts: 75,
    productGrowth: 0,
    totalOrders: 5,
    orderGrowth: 0,
    totalRevenue: 200,
    revenueGrowth: 0,
  };

  const salesChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [0, 0, 0, 0, 0, 0, 200],
  };

  const lowStockProducts = [
    { id: "1", name: "Tuxedo Jacket", stock: 8, minStock: 15 },
    { id: "2", name: "Elegant Evening Gown", stock: 10, minStock: 15 },
    { id: "3", name: "Wedding Suit Set", stock: 10, minStock: 15 },
    { id: "4", name: "Velvet Blazer", stock: 10, minStock: 15 },
    { id: "5", name: "Sequined Party Dress", stock: 12, minStock: 15 },
    { id: "6", name: "Satin Slip Dress", stock: 15, minStock: 15 },
    { id: "7", name: "Men's Party Blazer", stock: 15, minStock: 15 },
  ];

  const recentOrders = [
    {
      _id: "69887257c52a383c5b722c7e",
      user: "john@example.com",
      createdAt: "2026-02-08T11:24:07.078Z",
      total: 40,
      status: "processing",
    },
    {
      _id: "698871c4bde2846df0aea212",
      user: "john@example.com",
      createdAt: "2026-02-08T11:21:40.119Z",
      total: 40,
      status: "processing",
    },
    {
      _id: "69886f9c1e6a9cb7d37d1f31",
      user: "john@example.com",
      createdAt: "2026-02-08T11:12:28.023Z",
      total: 40,
      status: "processing",
    },
    {
      _id: "69886e4b5e9a86a9f3d5ac96",
      user: "john@example.com",
      createdAt: "2026-02-08T11:06:51.889Z",
      total: 40,
      status: "processing",
    },
    {
      _id: "69886a5eefb48d8189003124",
      user: "john@example.com",
      createdAt: "2026-02-08T10:50:06.739Z",
      total: 40,
      status: "processing",
    },
  ];

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
          value={metricsNormalized.totalUsers.toLocaleString()}
          change={metricsNormalized.userGrowth}
          icon={<Users className="w-6 h-6 text-primary-600" />}
        />
        <MetricCard
          title="Total Products"
          value={metricsNormalized.totalProducts.toLocaleString()}
          change={metricsNormalized.productGrowth}
          icon={<Package className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100 dark:bg-green-900/20"
        />
        <MetricCard
          title="Total Orders"
          value={metricsNormalized.totalOrders.toLocaleString()}
          change={metricsNormalized.orderGrowth}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metricsNormalized.totalRevenue.toLocaleString()}`}
          change={metricsNormalized.revenueGrowth}
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <SalesChart data={salesChartData} />
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
      <RecentOrders orders={recentOrders} />
    </div>
  );
};

export default Dashboard;
