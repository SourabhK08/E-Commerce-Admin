"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, Pencil, Trash2, Plus } from "lucide-react";
import ProductDrawer, {
  Product,
  DrawerMode,
} from "@/components/products/ProductDrawer";
import { toast } from "react-toastify";

const confirmDelete = (onConfirm: () => void) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-3 font-medium">Delete this product?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              onConfirm();
              closeToast();
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  console.log("products--->>>", products);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [drawerMode, setDrawerMode] = useState<DrawerMode>("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://dummyjson.com/products");
        setProducts(res.data.products);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);


  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleSuccess = (product: Product) => {
    if (drawerMode === "add") setProducts((p) => [product, ...p]);

    if (drawerMode === "edit")
      setProducts((p) => p.map((i) => (i.id === product.id ? product : i)));
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    confirmDelete(async () => {
      try {
        await axios.delete(`https://dummyjson.com/products/${id}`);
        setProducts((p) => p.filter((i) => i.id !== id));
        toast.success("Product deleted");
      } catch {
        toast.error("Delete failed");
      }
    });
  };

  return (
    <div className="relative w-full bg-white dark:bg-black overflow-x-hidden ">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pr-10 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600 focus:outline-none "
          />
          <Search
            size={20}
            className="absolute right-3 top-2.5 text-gray-500"
          />
        </div>
        <button
          onClick={() => {
            setDrawerMode("add");
            setSelectedProduct(null);
            setDrawerOpen(true);
          }}
          className="px-4 py-2 bg-black dark:bg-gray-800 border dark:border-gray-600 dark:hover:border dark:hover:border-gray-100 text-white rounded whitespace-nowrap flex items-center gap-2 hover:bg-transparent hover:text-black border-black dark:hover:text-white "
        >
          <Plus size={18} /> Add Product
        </button>
      </div>
      <div className="relative w-full mt-4 overflow-x-auto bg-white dark:bg-black">
        <table className="w-full min-w-[700px] md:min-w-[1000px] border text-sm dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="p-2">{product.id}</td>
                <td className="p-2">{product.title}</td>
                <td className="p-2">₹ {product.price}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2 capitalize">{product.category}</td>

                <td className="p-2 whitespace-nowrap">
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      className="flex items-center gap-1 border p-1 rounded-md px-2 hover:bg-gray-200 hover:dark:bg-gray-100 hover:text-blue-500"
                      onClick={() => {
                        setDrawerMode("view");
                        setSelectedProduct(product);
                        setDrawerOpen(true);
                      }}
                    >
                      <Eye size={14} />
                      View
                    </button>

                    <button
                      className="flex items-center gap-1 border p-1 rounded-md px-2 hover:bg-gray-200 hover:dark:bg-gray-100 hover:text-green-500"
                      onClick={() => {
                        setDrawerMode("edit");
                        setSelectedProduct(product);
                        setDrawerOpen(true);
                      }}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      className="flex items-center gap-1 border p-1 rounded-md px-2 hover:bg-gray-200 hover:dark:bg-gray-100 hover:text-red-500"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ProductDrawer
        open={drawerOpen}
        mode={drawerMode}
        product={selectedProduct}
        onClose={() => setDrawerOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
