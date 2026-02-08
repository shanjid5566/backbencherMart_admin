import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../store/api/adminApi";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  oldPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  dressStyle: z.string().min(1, "Dress style is required"),
  stock: z.number().min(0, "Stock must be positive"),
  colors: z.string(),
  sizes: z.string(),
});

type ProductInputs = z.infer<typeof productSchema>;

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { data: product, isLoading: isLoadingProduct } = useGetProductByIdQuery(
    id!,
    {
      skip: !id,
    },
  );
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice,
          category: product.category,
          dressStyle: product.dressStyle,
          stock: product.stock,
          colors: product.colors.join(", "),
          sizes: product.sizes.join(", "),
        }
      : undefined,
  });

  const onSubmit = async (data: ProductInputs) => {
    try {
      const productData = {
        ...data,
        colors: data.colors.split(",").map((c) => c.trim()),
        sizes: data.sizes.split(",").map((s) => s.trim()),
      };

      if (isEdit && id) {
        await updateProduct({ id, ...productData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(productData).unwrap();
        toast.success("Product created successfully");
      }
      navigate("/products");
    } catch (error) {
      toast.error(`Failed to ${isEdit ? "update" : "create"} product`);
    }
  };

  if (isLoadingProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEdit ? "Edit Product" : "Create Product"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isEdit
            ? "Update product details"
            : "Add a new product to your catalog"}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Product Name"
            placeholder="Classic White T-Shirt"
            error={errors.name?.message}
            {...register("name")}
          />

          <Textarea
            label="Description"
            placeholder="Detailed product description..."
            rows={4}
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              placeholder="29.99"
              error={errors.price?.message}
              {...register("price", { valueAsNumber: true })}
            />

            <Input
              label="Old Price (Optional)"
              type="number"
              step="0.01"
              placeholder="39.99"
              error={errors.oldPrice?.message}
              {...register("oldPrice", { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              error={errors.category?.message}
              {...register("category")}
              options={[
                { value: "", label: "Select category" },
                { value: "casual", label: "Casual" },
                { value: "formal", label: "Formal" },
                { value: "party", label: "Party" },
                { value: "gym", label: "Gym" },
              ]}
            />

            <Select
              label="Dress Style"
              error={errors.dressStyle?.message}
              {...register("dressStyle")}
              options={[
                { value: "", label: "Select style" },
                { value: "casual", label: "Casual" },
                { value: "formal", label: "Formal" },
                { value: "party", label: "Party" },
                { value: "gym", label: "Gym" },
              ]}
            />
          </div>

          <Input
            label="Stock"
            type="number"
            placeholder="100"
            error={errors.stock?.message}
            {...register("stock", { valueAsNumber: true })}
          />

          <Input
            label="Colors"
            placeholder="Red, Blue, Green (comma separated)"
            error={errors.colors?.message}
            {...register("colors")}
          />

          <Input
            label="Sizes"
            placeholder="S, M, L, XL (comma separated)"
            error={errors.sizes?.message}
            {...register("sizes")}
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating || isUpdating}>
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductForm;
