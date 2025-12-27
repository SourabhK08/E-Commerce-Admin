import { X } from "lucide-react";
import Link from "next/link";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full w-64
          bg-gray-100 dark:bg-gray-900 p-4
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          min-h-screen
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Admin</h2>

          <button onClick={onClose} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-3 text-md flex flex-col">
          <Link
            href="/dashboard"
            className="hover:text-gray-500 hover:text-opacity-90"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className="hover:text-gray-500 hover:text-opacity-90"
          >
            Products
          </Link>
          {/* <Link href="/dashboard/orders">Orders</Link>
          <Link href="/dashboard/users">Users</Link> */}
        </nav>
      </aside>
    </>
  );
}
