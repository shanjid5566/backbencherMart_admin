import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  useGetSalesAnalyticsQuery,
  useGetProductAnalyticsQuery,
} from "../../store/api/adminApi";
import Card from "../../components/ui/Card";
import { CardSkeleton } from "../../components/ui/LoadingSkeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Analytics = () => {
  const { data: salesData, isLoading: salesLoading } =
    useGetSalesAnalyticsQuery({});
  const { data: productData, isLoading: productLoading } =
    useGetProductAnalyticsQuery();

  const categoryChartData = {
    labels: ["Casual", "Formal", "Party", "Gym"],
    datasets: [
      {
        label: "Sales by Category",
        data: [45, 25, 20, 10],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  const monthlyRevenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [65000, 59000, 80000, 81000, 56000, 95000],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
    ],
  };

  if (salesLoading || productLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Analytics
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Comprehensive business insights and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Monthly Revenue" subtitle="Last 6 months">
          <div className="h-80">
            <Bar
              data={monthlyRevenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>

        <Card title="Sales by Category" subtitle="Distribution">
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Conversion Rate">
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              3.24%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              +0.5% from last month
            </p>
          </div>
        </Card>

        <Card title="Average Order Value">
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              $127.50
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              +$12.30 from last month
            </p>
          </div>
        </Card>

        <Card title="Customer Retention">
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              68%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              +5% from last month
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
