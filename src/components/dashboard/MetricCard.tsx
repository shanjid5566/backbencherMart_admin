interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconBgColor?: string;
}

const MetricCard = ({
  title,
  value,
  change,
  icon,
  iconBgColor = "bg-primary-100 dark:bg-primary-900/20",
}: MetricCardProps) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {value}
          </p>
          {change !== undefined && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {change > 0 ? `+${change}%` : `${change}%`} vs last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>{icon}</div>
      </div>
    </div>
  );
};

export default MetricCard;
