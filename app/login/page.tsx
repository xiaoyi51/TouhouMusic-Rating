"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
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
    console.log(data);

if (!res.ok) {
    alert(data.message);
    return;}

    setLoading(false);

    if (!res.ok) {
      setError(data.message || "登录失败");
      return;
    }

    // 登录成功 → 去评分页
    // 保存登录信息
localStorage.setItem("user_id", data.user.id);
localStorage.setItem("nickname", data.user.nickname);

    router.push("/rating");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-800">
      <div className="w-full max-w-md space-y-6 p-8 border border-stone-300 rounded-lg bg-white">
        
        <h1 className="text-2xl font-semibold text-center">
          登录
        </h1>

        <div className="space-y-3">
          <input
            className="w-full border border-stone-300 px-3 py-2 rounded"
            placeholder="昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <input
            className="w-full border border-stone-300 px-3 py-2 rounded"
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-stone-800 text-white py-2 rounded hover:bg-stone-700"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </div>

        <p className="text-sm text-center text-stone-500">
          还没有账号？{" "}
          <Link className="underline" href="/register">
            立即注册
          </Link>
        </p>
      </div>
    </main>
  );
}