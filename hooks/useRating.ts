import { songs } from "@/data/songs";
import { useEffect, useState } from "react";
import type { RatingRecord } from "@/data/rating";
import { supabase } from "@/lib/supabase";

type EditingState = {
    rating: number;
    comment: string;
};

type RatingRow = {
    song_id: number;
    rating: number;
    comment: string;
    updated_at: string;
    users?: {
        nickname: string;
    };
};

export function useRating() {
    const [nextImageReady, setNextImageReady] = useState(false);

    // ========================
    // 当前歌曲（✔ 持久化修复）
    // ========================
    const [currentSongId, setCurrentSongId] = useState<number>(() => {
        if (typeof window === "undefined") return 1;
        return Number(localStorage.getItem("currentSongId")) || 1;
    });

    const song = songs.find(s => s.id === currentSongId);
    if (!song) throw new Error("Song not found");
    useEffect(() => {
    if (!song?.image) return;

    const img = new Image();

    img.onload = () => setNextImageReady(true);
    img.onerror = () => setNextImageReady(false);

    img.src = song.image;
}, [song?.image]);

    // ========================
    // 编辑状态
    // ========================
    const [editing, setEditing] = useState<EditingState>({
        rating: 5,
        comment: "",
    });

    // ========================
    // ratingsMap（唯一数据源）
    // ========================
    const [ratingsMap, setRatingsMap] =
        useState<Record<number, RatingRecord>>({});

    const [submitted, setSubmitted] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);

    // ========================
    // ⭐统一刷新函数（关键修复点）
    // ========================
    const refreshRatings = async () => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return {};

        const { data, error } = await supabase
            .from("rating")
            .select("song_id, rating, comment, updated_at")
            .eq("user_id", user_id);

        if (error) {
            console.error(error);
            return {};
        }

        const mapped: Record<number, RatingRecord> = {};

        data?.forEach((item: RatingRow) => {
            mapped[item.song_id] = {
                rating: item.rating,
                comment: item.comment,
                updatedAt: item.updated_at,
                nickname: item.users?.nickname,
            };
        });

        setRatingsMap(mapped);
        return mapped;
    };

    // ========================
    // 初始加载
    // ========================
  useEffect(() => {
    let mounted = true;

    const run = async () => {
        const data = await refreshRatings();
        if (!mounted) return;
    };

    run();

    return () => {
        mounted = false;
    };
}, []);

    // ========================
    // 滚动
    // ========================
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentSongId]);

    // ========================
    // 保存评分
    // ========================
    async function saveRating(songId: number, rating: number, comment: string) {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return false;

        const res = await fetch("/api/rating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id,
                song_id: songId,
                rating,
                comment,
            }),
        });

        return res.ok;
    }

    // ========================
    // 切歌（✔ 修复：不读旧 ratingsMap）
    // ========================
    async function switchSong(songId: number) {

    const current = songs.find(s => s.id === currentSongId);
    if (!current) return;

    // ========================
    // 🚨 判断是否“真实修改过”
    // ========================
    const record = ratingsMap[current.id];

    const hasRealEdit =
        editing.rating !== 5 || editing.comment !== "";

    // ========================
    // 🚨 如果有修改 → 提示是否保存
    // ========================
    if (hasRealEdit) {
        const ok = confirm("当前评分尚未保存，是否保存？");

        if (!ok) {
            await saveRating(
                current.id,
                editing.rating,
                editing.comment
            );
        }
        return
    }

    // ⭐先切歌
    setCurrentSongId(songId);
    localStorage.setItem("currentSongId", String(songId));

    // ⭐再刷新数据
    const updated = await refreshRatings();

    const newRecord = updated[songId];

    setEditing({
        rating: newRecord?.rating ?? 5,
        comment: newRecord?.comment ?? "",
    });
}

    // ========================
    // 上一首 / 下一首
    // ========================
    const goPrevSong = async () => {
        if (currentSongId <= 1) return;
        await switchSong(currentSongId - 1);
    };

    const goNextSongSequential = async () => {
        if (currentSongId >= songs.length - 1) return;
        await switchSong(currentSongId + 1);
    };

    // ========================
    // 随机未评分
    // ========================
    const getRandomUnratedSong = () => {
        const unRatedSongs = songs.filter(s =>
            s.id !== 0 && !ratingsMap[s.id]
        );

        if (unRatedSongs.length === 0) return null;

        return unRatedSongs[
            Math.floor(Math.random() * unRatedSongs.length)
        ];
    };

    // ========================
    // 提交评分（✔ 修复 stale state）
    // ========================
    const handleSubmit = async () => {

        if (loadingNext) return;
        const hasRealEdit =
        editing.rating !== 5 || editing.comment !== "";

    // 🚨 没修改就不允许提交
    if (!hasRealEdit) {
        alert("你还没有修改评分");
        return;
    }

        setSubmitted(true);
        setLoadingNext(true);

        const user_id = localStorage.getItem("user_id");

        if (!user_id) {
            alert("请先登录！");
            setSubmitted(false);
            setLoadingNext(false);
            return;
        }

        const res = await fetch("/api/rating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id,
                songId: currentSongId,
                rating: editing.rating,
                comment: editing.comment,
            }),
        });

        if (!res.ok) {
            alert("评分保存失败");
            setSubmitted(false);
            setLoadingNext(false);
            return;
        }

        // ⭐关键：拿最新数据
        const updated = await refreshRatings();

        const unRatedSongs = songs.filter(s =>
            s.id !== 0 && !updated[s.id]
        );

        if (unRatedSongs.length > 0) {
            const nextSong =
                unRatedSongs[Math.floor(Math.random() * unRatedSongs.length)];

            await switchSong(nextSong.id);
        } else {
            alert("🎉 恭喜！所有歌曲已经全部完成！");
        }

        setSubmitted(false);
        setLoadingNext(false);
    };

    // ========================
    // 统计
    // ========================
    const totalCount = songs.filter(s => s.id !== 0).length;
    const finishedCount = Object.keys(ratingsMap).length;

    return {
        song,
        editing,
        setEditing,
        ratingsMap,
        submitted,
        loadingNext,
        handleSubmit,
        getRandomUnratedSong,
        switchSong,
        currentSongId,
        totalCount,
        finishedCount,
        goPrevSong,
        goNextSongSequential,
    };
}