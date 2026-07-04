"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { songs } from "@/data/songs";

type RatingItem = {
    song_id: number;
    rating: number;
    comment: string;
    updated_at: string;
};

export default function ProfilePage() {

    const [ratings, setRatings] = useState<RatingItem[]>([]);
    const [loading, setLoading] = useState(true);

    // ===== 编辑状态 =====
    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempRating, setTempRating] = useState(5);
    const [tempComment, setTempComment] = useState("");

    // ===== 获取歌曲名 =====
    function getSongTitle(id: number) {
        return songs.find(s => s.id === id)?.title ?? "未知歌曲";
    }

    // ===== 加载数据 =====
    useEffect(() => {
        async function load() {
            const user_id = localStorage.getItem("user_id");
            if (!user_id) return;

            const { data, error } = await supabase
                .from("rating")
                .select("*")
                .eq("user_id", user_id);

            if (error) {
                console.error(error);
                return;
            }

            setRatings(data || []);
            setLoading(false);
        }

        load();
    }, []);

    // ===== 删除评分 =====
    async function deleteRating(song_id: number) {
        const user_id = localStorage.getItem("user_id");

        const res = await fetch("/api/delete_rating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, song_id }),
        });

        if (res.ok) {
            setRatings(prev => prev.filter(r => r.song_id !== song_id));
        }
    }

    // ===== 删除账号 =====
    async function deleteAccount() {
        const user_id = localStorage.getItem("user_id");

        const res = await fetch("/api/delete_account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id }),
        });

        if (res.ok) {
            localStorage.removeItem("user_id");
            window.location.href = "/";
        }
    }

    // ===== 保存修改评分 =====
    async function saveEdit(song_id: number) {
        const user_id = localStorage.getItem("user_id");

        const res = await supabase
            .from("rating")
            .update({
                rating: tempRating,
                comment: tempComment,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", user_id)
            .eq("song_id", song_id);

        if (!res.error) {
            setRatings(prev =>
                prev.map(r =>
                    r.song_id === song_id
                        ? { ...r, rating: tempRating, comment: tempComment }
                        : r
                )
            );

            setEditingId(null);
        }
    }

    if (loading) {
        return <div className="p-10">加载中...</div>;
    }

    return (
        <main className="max-w-2xl mx-auto p-6 space-y-6">

            {/* 标题 */}
            <h1 className="text-2xl font-bold">
                个人中心
            </h1>

            {/* 删除账号 */}
            <button
                onClick={deleteAccount}
                className="text-red-600 text-sm underline"
            >
                删除账号（不可恢复）
            </button>

            {/* 评分列表 */}
            <div className="space-y-4">

                {ratings.map(item => (
                    <div
                        key={item.song_id}
                        className="border rounded-xl p-4 bg-white shadow-sm space-y-2"
                    >

                        {/* 歌曲名 */}
                        <div className="font-medium">
                            {getSongTitle(item.song_id)}
                        </div>

                        {/* 评分 */}
                        <div className="text-sm text-stone-600">
                            评分：<span className="font-semibold">{item.rating}</span>
                        </div>

                        {/* 评论 */}
                        <div className="text-sm text-stone-500">
                            {item.comment}
                        </div>

                        {/* 操作按钮 */}
                        <div className="space-x-3 text-sm">

                            {/* 修改 */}
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

                            {/* 删除 */}
                            <button
                                className="text-red-500"
                                onClick={() => deleteRating(item.song_id)}
                            >
                                删除
                            </button>
                        </div>

                        {/* 编辑区域 */}
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