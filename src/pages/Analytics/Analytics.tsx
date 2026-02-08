import { useMemo, useState } from "react";
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
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import {
  useGetBusinessMetricsQuery,
  useGetMonthlyRevenueQuery,
  useGetSalesByCategoryQuery,
} from "../../store/analytics/analyticsApi";
import { formatCurrency, formatPercentage } from "../../utils/formatters";

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
  const [months, setMonths] = useState(12);
  const { data: revenueData, isLoading: isRevenueLoading } =
    useGetMonthlyRevenueQuery(months);
  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetSalesByCategoryQuery(undefined);
  const { data: metricsData, isLoading: isMetricsLoading } =
    useGetBusinessMetricsQuery(undefined);

  type RevenueItem = {
    month: string;
    year: number;
    revenue: number;
    orders: number;
  };

  type CategoryItem = {
    category: string;
    revenue: number;
    items: number;
    percentage: number;
  };

  const monthlyRevenueChart = useMemo(() => {
    const items: RevenueItem[] = revenueData?.data || [];
    return {
      labels: items.map((item: RevenueItem) => `${item.month} ${item.year}`),
      datasets: [
        {
          label: "Revenue",
          data: items.map((item: RevenueItem) => item.revenue),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
        },
      ],
    };
  }, [revenueData]);

  const categoryChartData = useMemo(() => {
    const palette = [
      "rgba(59, 130, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(14, 116, 144, 0.8)",
    ];
    const items: CategoryItem[] = categoryData?.data || [];
    return {
      labels: items.map((item: CategoryItem) => item.category),
      datasets: [
        {
          label: "Sales by Category",
          data: items.map((item: CategoryItem) => item.revenue),
          backgroundColor: items.map(
            (_: CategoryItem, index: number) => palette[index % palette.length],
          ),
        },
      ],
    };
  }, [categoryData]);

  const monthOptions = [
    { value: 1, label: "1 month" },
    { value: 3, label: "3 months" },
    { value: 6, label: "6 months" },
    { value: 12, label: "12 months" },
  ];

  const formatChange = (value: number) => {
    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    return `${sign}${Math.abs(value).toFixed(2)}%`;
  };

  const formatCurrencyChange = (value: number) => {
    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    return `${sign}${formatCurrency(Math.abs(value))}`;
  };

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
        <Card
          title="Monthly Revenue"
          subtitle={`Last ${months} month${months === 1 ? "" : "s"}`}
          action={
            <div className="min-w-[140px]">
              <Select
                options={monthOptions}
                value={months}
                onChange={(event) =>
                  setMonths(Number(event.target.value || 12))
                }
              />
            </div>
          }
        >
          <div className="h-80">
            {isRevenueLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                Loading revenue data...
              </div>
            ) : (
              <Bar
                data={monthlyRevenueChart}
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
            )}
          </div>
        </Card>

        <Card title="Sales by Category" subtitle="Distribution">
          <div className="h-80 flex items-center justify-center">
            {isCategoryLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                Loading category data...
              </div>
            ) : (
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
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Conversion Rate">
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              {isMetricsLoading
                ? "--"
                : formatPercentage(metricsData?.conversionRate ?? 0, 2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isMetricsLoading
                ? "Loading change..."
                : `${formatChange(metricsData?.conversionChange ?? 0)} from last month`}
            </p>
          </div>
        </Card>

        <Card title="Average Order Value">
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              {isMetricsLoading
                ? "--"
                : formatCurrency(metricsData?.avgOrderValue ?? 0)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isMetricsLoading
                ? "Loading change..."
                : `${formatCurrencyChange(metricsData?.avgOrderChange ?? 0)} from last month`}
            </p>
          </div>
        </Card>

        <Card title="Customer Retention">
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {isMetricsLoading
                ? "--"
                : formatPercentage(metricsData?.customerRetention ?? 0, 2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isMetricsLoading ? "Loading metrics..." : "Latest snapshot"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
