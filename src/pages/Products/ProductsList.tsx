import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import Modal from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../store/products/productsApi";

type ApiProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  averageRatings?: number;
  createdAt?: string;
  image?: string[];
};

const ProductsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [formState, setFormState] = useState({
    name: "",
    price: "",
    oldPrice: "",
    discountPercentage: "",
    category: "",
    dressStyle: "",
    colors: "",
    sizes: [] as string[],
    inStock: true,
    description: "",
    stock: "",
    images: [] as File[],
  });
  const [editState, setEditState] = useState({
    price: "",
    stock: "",
  });

  const { data, isLoading, refetch } = useGetProductsQuery({
    page,
    limit: 10,
  });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const pageSize = data?.meta?.limit ?? 10;
  const totalPages = data?.meta?.totalPages ?? 1;
  const total = data?.meta?.totalItems ?? 0;

  const products = useMemo(() => {
    return (data?.items || []).map((item: ApiProduct) => ({
      _id: item._id,
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      averageRatings: item.averageRatings,
      createdAt: item.createdAt || new Date().toISOString(),
      images: item.image || [],
    }));
  }, [data]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !search || product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !categoryFilter ||
        product.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const currentPage = Math.min(page, totalPages);
  const pagedProducts = filteredProducts;

  const handleAddOpen = () => {
    setFormState({
      name: "",
      price: "",
      oldPrice: "",
      discountPercentage: "",
      category: "",
      dressStyle: "",
      colors: "",
      sizes: [],
      inStock: true,
      description: "",
      stock: "",
      images: [],
    });
    setIsAddModalOpen(true);
  };

  const handleAddClose = () => {
    setIsAddModalOpen(false);
  };

  const handleEditOpen = (product: (typeof products)[number]) => {
    setSelectedProductId(product._id);
    setEditState({
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
    });
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setSelectedProductId(null);
  };

  const handleFormChange = (
    field: keyof typeof formState,
    value: string | boolean,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeToggle = (size: string) => {
    setFormState((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((item) => item !== size)
          : [...prev.sizes, size],
      };
    });
  };

  const handleImagesChange = (files: FileList | null) => {
    setFormState((prev) => ({
      ...prev,
      images: files ? Array.from(files) : [],
    }));
  };

  const handleAddSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.name.trim());
      formData.append("price", String(formState.price));
      if (formState.oldPrice) {
        formData.append("oldPrice", String(formState.oldPrice));
      }
      if (formState.discountPercentage) {
        formData.append(
          "discountPercentage",
          String(formState.discountPercentage),
        );
      }
      formData.append("category", formState.category || "men");
      if (formState.dressStyle) {
        formData.append("dressStyle", formState.dressStyle);
      }
      if (formState.colors) {
        formData.append("colors", formState.colors);
      }
      if (formState.sizes.length) {
        formData.append("sizes", formState.sizes.join(","));
      }
      formData.append("inStock", formState.inStock ? "true" : "false");
      formData.append("description", formState.description.trim());
      formData.append("stock", String(formState.stock));
      formState.images.forEach((file) => {
        formData.append("images", file);
      });

      await createProduct(formData).unwrap();
      toast.success("Product added successfully");
      setIsAddModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleUpdateSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedProductId) return;
    try {
      await updateProduct({
        id: selectedProductId,
        price: Number(editState.price),
        stock: Number(editState.stock),
      }).unwrap();
      toast.success("Product updated successfully");
      setIsEditModalOpen(false);
      setSelectedProductId(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={handleAddOpen}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearch(event.target.value)
              }
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setCategoryFilter(event.target.value)
            }
            options={[
              { value: "", label: "All Categories" },
              { value: "men", label: "Men" },
              { value: "women", label: "Women" },
            ]}
          />
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : (
          <div className="overflow-x-auto">
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
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rating
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedProducts.map((product) => (
                  <tr key={product._id} className="table-row">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{product.category}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={product.stock > 10 ? "success" : "warning"}
                      >
                        {product.stock} units
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      ⭐ {product.averageRatings?.toFixed(1) || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOpen(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-700"
                          isLoading={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
              {Math.min(currentPage * pageSize, total)} of {total} products
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

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleAddClose}
        title="Add Product"
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input
              label="Name"
              placeholder="Elegant Dress"
              value={formState.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              required
            />

            <Textarea
              label="Description"
              placeholder="Dress Drescription ..."
              rows={3}
              value={formState.description}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                handleFormChange("description", event.target.value)
              }
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                placeholder="1299.99"
                value={formState.price}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFormChange("price", event.target.value)
                }
                required
              />
              <Input
                label="Old Price"
                type="number"
                step="0.01"
                placeholder="1499.99"
                value={formState.oldPrice}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFormChange("oldPrice", event.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Discount Percentage"
                type="number"
                placeholder="10"
                value={formState.discountPercentage}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFormChange("discountPercentage", event.target.value)
                }
              />
              <Select
                label="Category"
                value={formState.category}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  handleFormChange("category", event.target.value)
                }
                options={[
                  { value: "men", label: "Men" },
                  { value: "women", label: "Women" },
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Dress Style"
                value={formState.dressStyle}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  handleFormChange("dressStyle", event.target.value)
                }
                options={[
                  { value: "Casual", label: "Casual" },
                  { value: "Formal", label: "Formal" },
                  { value: "Party", label: "Party" },
                  { value: "Gym", label: "Gym" },
                ]}
              />
              <Input
                label="Colors"
                placeholder="black, gray"
                value={formState.colors}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFormChange("colors", event.target.value)
                }
                helperText="Comma-separated list"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Sizes</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <label
                      key={size}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={formState.sizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
              <Select
                label="In Stock"
                value={formState.inStock ? "true" : "false"}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  handleFormChange("inStock", event.target.value === "true")
                }
                options={[
                  { value: "true", label: "true" },
                  { value: "false", label: "false" },
                ]}
              />
            </div>

            <Input
              label="Stock"
              type="number"
              placeholder="50"
              value={formState.stock}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFormChange("stock", event.target.value)
              }
              required
            />

            <div>
              <label className="label-text">
                Images
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="input-field"
                onChange={(e) => handleImagesChange(e.target.files)}
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload one or more images.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddClose}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isCreating}>
                Add Product
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        title="Update Product"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            placeholder="1199.99"
            value={editState.price}
            onChange={(e) =>
              setEditState((prev) => ({ ...prev, price: e.target.value }))
            }
            required
          />
          <Input
            label="Stock"
            type="number"
            placeholder="45"
            value={editState.stock}
            onChange={(e) =>
              setEditState((prev) => ({ ...prev, stock: e.target.value }))
            }
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleEditClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isUpdating}>
              Update Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsList;
