import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { user_id } = await req.json();

        if (!user_id) {
            return NextResponse.json(
                { message: "缺少 user_id" },
                { status: 400 }
            );
        }

        // 1. 删除该用户所有评分
        const { error: ratingError } = await supabase
            .from("rating")
            .delete()
            .eq("user_id", user_id);

        if (ratingError) {
            return NextResponse.json(
                { message: ratingError.message },
                { status: 500 }
            );
        }

        // 2. 删除用户本身
        const { error: userError } = await supabase
            .from("users")
            .delete()
            .eq("id", user_id);

        if (userError) {
            return NextResponse.json(
                { message: userError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "账号删除成功"
        });

    } catch {
        return NextResponse.json(
            { message: "server error" },
            { status: 500 }
        );
    }
}