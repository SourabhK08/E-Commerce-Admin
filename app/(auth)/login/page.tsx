"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";

type LoginData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginData>();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginData) => {
    console.log("Login data:", data);
    setLoading(true);

    try {
      const res = await axios.post("https://dummyjson.com/auth/login", {
        username: data.username,
        password: data.password,
      });

      const token = res.data.accessToken;
      login(token);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError("username", { type: "manual", message: "Invalid credentials" });
      setError("password", { type: "manual", message: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">Admin Login</h1>

        <form onSubmit={handleSubmit(handleLogin)}>
          <input
            className="w-full mb-3 p-2 border rounded dark:bg-gray-700"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="text-sm text-red-500 mb-2">
              {errors.username.message}
            </p>
          )}

          <input
            type="password"
            className="w-full mb-3 p-2 border rounded dark:bg-gray-700"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />

          {errors.password && (
            <p className="text-sm text-red-500 mb-2">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-xs text-center mt-4 opacity-70">
          Test credentials: <b>emilys / emilyspass</b>
        </p>
      </div>
    </div>
  );
}
