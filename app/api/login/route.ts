import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPassword } from "@/lib/password";

export async function POST(req: Request) {
  try {
    const { nickname, password } = await req.json();

    if (!nickname || !password) {
      return NextResponse.json(
        { message: "缺少昵称或密码" },
        { status: 400 }
      );
    }

    // 1. 查用户
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("nickname", nickname)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: "用户不存在" },
        { status: 400 }
      );
    }

    // 2. 验证密码
    const ok = await verifyPassword(password, user.password_hash);

    if (!ok) {
      return NextResponse.json(
        { message: "密码错误" },
        { status: 400 }
      );
    }

    // 3. 登录成功（先简单返回 user_id）
    return NextResponse.json({
      message: "登录成功",
      user: {
        id: user.id,
        nickname: user.nickname,
      },
    });

  } catch (err) {
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}