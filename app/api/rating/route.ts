import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      user_id,
      song_id,
      rating,
      comment,
    } = await req.json();

    const { error } = await supabase
      .from("rating")
      .upsert(
        {
          user_id,
          song_id,
          rating,
          comment,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,song_id",
        }
      );

    if (error) {
        console.error(error);  
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "success",
    });

  } catch {
    return NextResponse.json(
      { message: "server error" },
      { status: 500 }
    );
  }
}