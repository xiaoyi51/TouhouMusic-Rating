"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setError("");

    if (!nickname || !password) {
      setError("请填写完整信息");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次密码不一致");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "注册失败");
        setLoading(false);
        return;
      }

      setLoading(false);

      alert("注册成功，请登录");
      router.push("/login");

    } catch (err) {
      setLoading(false);
      setError("网络错误，请稍后再试");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-800">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-stone-300 bg-white p-8">

        <h1 className="text-center text-2xl font-semibold">
          注册账号
        </h1>

        <div className="space-y-3">

          <input
            className="w-full rounded border border-stone-300 px-3 py-2"
            placeholder="昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <input
            className="w-full rounded border border-stone-300 px-3 py-2"
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="w-full rounded border border-stone-300 px-3 py-2"
            type="password"
            placeholder="确认密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded bg-stone-800 py-2 text-white hover:bg-stone-700"
          >
            {loading ? "注册中..." : "注册"}
          </button>

        </div>

        <p className="text-center text-sm text-stone-500">
          已有账号？{" "}
          <Link href="/login" className="underline">
            去登录
          </Link>
        </p>

      </div>
    </main>
  );
}