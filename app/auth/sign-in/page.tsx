"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submitLogin() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Email atau password salah");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/`;

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/member/dashboard");
      }
    } catch (error) {
      alert("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-white
      to-emerald-50
      flex
      items-center
      justify-center
      p-6
      "
    >
      <div
        className="
        bg-white
        max-w-md
        w-full
        rounded-3xl
        shadow-md
        p-6
        "
      >
        <div className="text-center mb-6">
          <div
            className="
            mx-auto
            w-14
            h-14
            bg-emerald-100
            text-emerald-600
            rounded-2xl
            flex
            items-center
            justify-center
            "
          >
            <LogIn />
          </div>

          <h1
            className="
            text-xl
            font-bold
            mt-4
            "
          >
            Login
          </h1>

          <p
            className="
            text-sm
            text-slate-400
            "
          >
            Login Member & Admin Area
          </p>
        </div>

        <div className="space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="
            w-full
            p-3
            rounded-2xl
            bg-slate-50
            outline-none
            "
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="
            w-full
            p-3
            rounded-2xl
            bg-slate-50
            outline-none
            "
          />

          <button
            onClick={submitLogin}
            disabled={loading}
            className="
            w-full
            py-3
            bg-emerald-500
            text-white
            rounded-2xl
            font-semibold
            disabled:opacity-50
            "
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>

        <p
          className="
          text-center
          text-sm
          mt-5
          text-slate-500
          "
        >
          Belum punya akun?
          <Link
            href="/auth/sign-up"
            className="
            text-emerald-600
            font-semibold
            ml-1
            "
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
