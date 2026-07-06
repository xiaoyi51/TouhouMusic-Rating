"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { songs } from "@/data/songs";
import { useRouter } from "next/navigation";

type RatingItem = {
    song_id: number;
    rating: number;
    comment: string;
    updated_at: string;
};

export default function ProfilePage() {

    const [userId, setUserId] = useState<string | null>(null);
    const [ratings, setRatings] = useState<RatingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
    const router = useRouter();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempRating, setTempRating] = useState(5);
    const [tempComment, setTempComment] = useState("");

    // ========================
    // 获取当前用户（安全核心）
    // ========================
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            setUserId(user.id);

            const { data, error } = await supabase
                .from("rating")
                .select("song_id, rating, comment, updated_at")
                .eq("user_id", user.id);

            if (error) {
                console.error(error);
            } else {
                setRatings(data || []);
            }

            setLoading(false);
        };

        init();
    }, []);

    // ========================
    // 歌曲名
    // ========================
    function getSongTitle(id: number) {
        return songs.find(s => s.id === id)?.title ?? "未知歌曲";
    }

    // ========================
    // 删除评分（安全版）
    // ========================
    async function deleteRating(song_id: number) {
    if (!userId) return;

    const { error } = await supabase
        .from("rating")
        .delete()
        .eq("user_id", userId)
        .eq("song_id", song_id);

    if (error) {
        console.error("delete error:", error);
        alert("删除失败");
        return;
    }

    // ✅ 关键修复：重新拉取最新数据，保证 UI 和数据库一致
    const { data, error: fetchError } = await supabase
        .from("rating")
        .select("song_id, rating, comment, updated_at")
        .eq("user_id", userId);

    if (fetchError) {
        console.error(fetchError);
        return;
    }

    setRatings(data || []);
}

    // ========================
    // 修改评分（安全版）
    // ========================
    async function saveEdit(song_id: number) {
        if (!userId) return;

        const { error } = await supabase
            .from("rating")
            .update({
                rating: tempRating,
                comment: tempComment,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("song_id", song_id);

        if (error) {
            console.error(error);
            alert("更新失败");
            return;
        }

        setRatings(prev =>
            prev.map(r =>
                r.song_id === song_id
                    ? { ...r, rating: tempRating, comment: tempComment }
                    : r
            )
        );

        setEditingId(null);
    }

    // ========================
    // 删除账号（安全版）
    // ⚠️ 这里只做退出登录 + 清理数据
    // ========================
    async function deleteAccount() {
        if (!userId) return;

        const { error } = await supabase
            .from("rating")
            .delete()
            .eq("user_id", userId);

        if (error) {
            alert("清理数据失败");
            return;
        }

        await supabase.auth.signOut();

        window.location.href = "/";
    }

    // ========================
    // loading
    // ========================
    if (loading) {
        return <div className="p-10">加载中...</div>;
    }

    if (!userId) {
        return <div className="p-10">请先登录</div>;
    }

    const sortedRatings = [...ratings].sort((a, b) => {
    return sortOrder === "desc"
        ? b.rating - a.rating
        : a.rating - b.rating;
});

    return (
        <main className="max-w-2xl mx-auto p-6 space-y-6">

            <h1 className="text-2xl font-bold">个人中心</h1>
            <div className="flex gap-2 text-sm mt-2">

    <button
        onClick={() => setSortOrder("desc")}
        className={`px-3 py-1 border rounded ${
            sortOrder === "desc" ? "bg-black text-white" : ""
        }`}
    >
        🔼 高 → 低
    </button>

    <button
        onClick={() => setSortOrder("asc")}
        className={`px-3 py-1 border rounded ${
            sortOrder === "asc" ? "bg-black text-white" : ""
        }`}
    >
        🔽 低 → 高
    </button>

</div>

            {/* 删除账号 */}
            <button
                onClick={deleteAccount}
                className="text-red-600 text-sm underline"
            >
                删除账号（不可恢复）
            </button>

            <div className="space-y-4">

                {sortedRatings.map(item => (
                    <div
                        key={`${item.song_id}-${item.updated_at}`}
                        className="border rounded-xl p-4 bg-white shadow-sm space-y-2"
                    >

                        <div
    className="font-medium cursor-pointer hover:underline"
    onClick={() => router.push(`/rate?songId=${item.song_id}`)}
>
    {getSongTitle(item.song_id)}
</div>

                        <div className="text-sm text-stone-600">
                            评分：<span className="font-semibold">{item.rating}</span>
                        </div>

                        <div className="text-sm text-stone-500">
                            {item.comment}
                        </div>

                        <div className="space-x-3 text-sm">

                            <button
                                className="text-blue-500"
                                onClick={() => {
                                    setEditingId(item.song_id);
                                    setTempRating(item.rating);
                                    setTempComment(item.comment);
                                }}
                            >
                                修改
                            </button>

                            <button
                                className="text-red-500"
                                onClick={() => deleteRating(item.song_id)}
                            >
                                删除
                            </button>

                        </div>

                        {editingId === item.song_id && (
                            <div className="mt-3 border-t pt-3 space-y-2">

                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    value={tempRating}
                                    onChange={(e) =>
                                        setTempRating(Number(e.target.value))
                                    }
                                    className="border px-2 py-1 w-20"
                                />

                                <input
                                    value={tempComment}
                                    onChange={(e) =>
                                        setTempComment(e.target.value)
                                    }
                                    className="border px-2 py-1 w-full"
                                />

                                <div className="space-x-2">

                                    <button
                                        className="text-green-600"
                                        onClick={() => saveEdit(item.song_id)}
                                    >
                                        保存
                                    </button>

                                    <button
                                        className="text-gray-500"
                                        onClick={() => setEditingId(null)}
                                    >
                                        取消
                                    </button>

                                </div>
                            </div>
                        )}

                    </div>
                ))}

            </div>
        </main>
    );
}