import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Order } from '../../types'
import { formatDate, formatCurrency } from '../../utils/formatters'

interface RecentOrdersProps {
  orders?: Order[]
  isLoading?: boolean
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'processing':
      return 'info'
    case 'cancelled':
      return 'danger'
    case 'refunded':
      return 'warning'
    default:
      return 'default'
  }
}

const RecentOrders = ({ orders = [], isLoading }: RecentOrdersProps) => {
  if (isLoading) {
    return (
      <Card title="Recent Orders">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card
      title="Recent Orders"
      subtitle={`${orders.length} orders`}
      action={
        <Link to="/orders">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      }
    >
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
            {orders.slice(0, 5).map((order) => (
              <tr key={order._id} className="table-row">
                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  #{order._id.slice(-6)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {typeof order.user === 'object' ? order.user.email : order.user}
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
                  <Link to={`/orders/${order._id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default RecentOrders
