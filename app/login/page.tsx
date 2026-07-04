"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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

    if (!nickname || !password) {
      setError("请输入昵称和密码");
      setLoading(false);
      return;
    }

    // 1. 查询用户
    const { data: user, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("nickname", nickname)
      .single();

    if (queryError || !user) {
      setError("用户不存在");
      setLoading(false);
      return;
    }

    // 2. 密码校验（当前简化版）
    if (password !== user.password_hash) {
      setError("密码错误");
      setLoading(false);
      return;
    }

    // 3. 登录成功
    localStorage.setItem("user_id", user.id);
    localStorage.setItem("nickname", user.nickname);

    setLoading(false);
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