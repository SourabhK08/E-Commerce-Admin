"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded bg-red-500 text-white text-sm"
    >
      Logout
    </button>
  );
}
