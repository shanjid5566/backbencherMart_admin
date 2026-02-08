import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import { useGetProductsQuery } from "../../store/products/productsApi";

const FAQsList = () => {
  const navigate = useNavigate();
  const [productsPage, setProductsPage] = useState(1);

  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery({
      page: productsPage,
      limit: 10,
    });

  type ApiProduct = {
    _id: string;
    name: string;
    category: string;
    image?: string[];
  };

  const products = useMemo(() => {
    return (productsData?.items || []).map((product: ApiProduct) => ({
      _id: product._id,
      name: product.name,
      category: product.category,
      image: product.image?.[0],
    }));
  }, [productsData]);

  const productsTotal = productsData?.meta?.totalItems ?? 0;
  const productsTotalPages = productsData?.meta?.totalPages ?? 1;
  const productsPageSize = productsData?.meta?.limit ?? 10;
  const currentProductPage = Math.min(productsPage, productsTotalPages);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          FAQs
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Select a product to view FAQ details
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Products
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the eye icon to view FAQs for a product
            </p>
          </div>
        </div>

        {isProductsLoading ? (
          <div className="mt-4">
            <TableSkeleton rows={6} columns={3} />
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="table-row">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.png"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {product.category}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/faqs/${product._id}`, {
                            state: { productName: product.name },
                          })
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {productsTotalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentProductPage - 1) * productsPageSize + 1} to{" "}
              {Math.min(currentProductPage * productsPageSize, productsTotal)}{" "}
              of {productsTotal} products
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setProductsPage(currentProductPage - 1)}
                disabled={currentProductPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setProductsPage(currentProductPage + 1)}
                disabled={currentProductPage === productsTotalPages}
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

export default FAQsList;
