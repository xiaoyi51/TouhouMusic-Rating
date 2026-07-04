import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { user_id, song_id } = await req.json();

        if (!user_id || !song_id) {
            return NextResponse.json(
                { message: "缺少参数" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("rating")
            .delete()
            .eq("user_id", user_id)
            .eq("song_id", song_id);

        if (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "评分删除成功"
        });

    } catch {
        return NextResponse.json(
            { message: "server error" },
            { status: 500 }
        );
    }
}