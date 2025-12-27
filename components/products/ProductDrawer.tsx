"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export type DrawerMode = "add" | "edit" | "view";

export type Product = {
  id?: number;
  title: string;
  price: number | null;
  stock: number | null;
  category: string;
};

type Props = {
  open: boolean;
  mode: DrawerMode;
  product: Product | null;
  onClose: () => void;
  onSuccess: (product: Product) => void;
};

export default function ProductDrawer({
  open,
  mode,
  product,
  onClose,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Product>();

  console.log("errors", errors);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && product) {
      reset(product);
    }

    if (mode === "add") {
      reset({
        title: "",
        price: null,
        stock: null,
        category: "",
      });
    }
  }, [product, mode, reset]);

  if (!open) return null;

  const isView = mode === "view";

  const onSubmit = async (data: Product) => {
    try {
      let res;

      if (mode === "add") {
        res = await axios.post("https://dummyjson.com/products/add", data);
        toast.success("Product added successfully");
      }

      if (mode === "edit" && product?.id) {
        res = await axios.put(`https://dummyjson.com/products/${product.id}`, {
          title: data.title,
          price: data.price,
          stock: data.stock,
          category: data.category,
        });
        toast.success("Product updated successfully");
      }

      onSuccess(res!.data);
      onClose();
    } catch {
      toast.error("Action failed");
    } finally {
      reset();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 z-50">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold capitalize">{mode} Product</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <input
              {...register("title", { required: true })}
              disabled={isView}
              className="w-full p-2 border rounded dark:bg-gray-800"
              placeholder="Enter name"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">Name is required</p>
            )}
          </div>

          <div>
            <label className="text-sm">Price</label>
            <input
              type="number"
              {...register("price", { required: true })}
              step="0.01"
              disabled={isView}
              className="w-full p-2 border rounded dark:bg-gray-800"
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-2">Price is required</p>
            )}
          </div>

          <div>
            <label className="text-sm">Stock</label>
            <input
              type="number"
              {...register("stock", { required: true })}
              step="0.01"
              disabled={isView}
              className="w-full p-2 border rounded dark:bg-gray-800"
              placeholder="Enter stock"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-2">Stock is required</p>
            )}
          </div>

          <div>
            <label className="text-sm">Category</label>
            <input
              {...register("category", { required: true })}
              disabled={isView}
              className="w-full p-2 border rounded dark:bg-gray-800"
              placeholder="Enter category"
            />
            {errors.category && (
              <p className="text-red-500 text-sm">Category is required</p>
            )}
          </div>

          {mode !== "view" && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2 rounded"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          )}
        </form>
      </div>
    </>
  );
}
