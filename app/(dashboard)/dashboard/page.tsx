"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "@/components/dashboard/StatCard";

type DashboardStats = {
  totalProducts: number;
  todayOrders: number;
  monthlyRevenue: number;
};

type Product = {
  price: number;
};


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  console.log("stats-->", stats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await axios.get("https://dummyjson.com/products");
        const data = res.data;
        console.log("Products data-- :", data);

        const totalProducts = data.total;

        const todayOrders = Math.floor(Math.random() * 30);
        const monthlyRevenue = data.products
          .reduce((sum: number, p: Product) => sum + p.price, 0)
          .toFixed(2);

        setStats({
          totalProducts,
          todayOrders,
          monthlyRevenue: Number(monthlyRevenue),
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Products" value={stats!.totalProducts} />
        <StatCard title="Orders Today" value={stats!.todayOrders} />
        <StatCard
          title="Monthly Revenue"
          value={`₹ ${stats!.monthlyRevenue}`}
        />
      </div>
    </div>
  );
}
