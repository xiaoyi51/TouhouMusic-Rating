import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  try {
    const { nickname, password } = await req.json();

    if (!nickname || !password) {
      return NextResponse.json(
        { message: "缺少昵称或密码" },
        { status: 400 }
      );
    }

    // 1. 检查是否已存在
    const { data: exist } = await supabase
      .from("users")
      .select("id")
      .eq("nickname", nickname)
      .single();

    if (exist) {
      return NextResponse.json(
        { message: "昵称已存在" },
        { status: 400 }
      );
    }

    // 2. 加密密码
    const password_hash = await hashPassword(password);

    // 3. 插入用户
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          nickname,
          password_hash,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "注册成功",
      user: {
        id: data.id,
        nickname: data.nickname,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}