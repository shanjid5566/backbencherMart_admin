import { TrendingUp, TrendingDown } from 'lucide-react'

const MetricCard = ({ title, value, change, icon, iconBgColor = 'bg-primary-100 dark:bg-primary-900/20' }: MetricCardProps) => {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

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
          {/* {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && <TrendingUp className="w-4 h-4 text-green-500" />}
              {isNegative && <TrendingDown className="w-4 h-4 text-red-500" />}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-600 dark:text-green-400' : 
                isNegative ? 'text-red-600 dark:text-red-400' : 
                'text-gray-600 dark:text-gray-400'
              }`}>
                {change > 0 && '+'}{change}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          )} */}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default MetricCard

