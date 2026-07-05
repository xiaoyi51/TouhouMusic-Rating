import { songs } from "@/data/songs";
import { useEffect, useState, useCallback } from "react";
import type { RatingRecord } from "@/data/rating";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

type EditingState = {
    rating: number;
    comment: string;
};

type RatingRow = {
    song_id: number;
    rating: number;
    comment: string;
    updated_at: string;
};

export function useRating() {

    // ========================
    // 当前歌曲
    // ========================
const searchParams = useSearchParams();
const urlSongId = Number(searchParams.get("songId"));
const [currentSongId, setCurrentSongId] = useState<number>(() => {
    if (typeof window === "undefined") return 1;

    // 1️⃣ URL 优先
    if (urlSongId && !Number.isNaN(urlSongId) && urlSongId > 0) {
        return urlSongId;
    }

    // 2️⃣ fallback localStorage
    return Number(localStorage.getItem("currentSongId")) || 1;
});


    const song = songs.find(s => s.id === currentSongId);
    if (!song) throw new Error("Song not found");

    // ========================
    // UI state
    // ========================
    const [editing, setEditing] = useState<EditingState>({
        rating: 5,
        comment: "",
    });

    const [ratingsMap, setRatingsMap] = useState<Record<number, RatingRecord>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);
    const [dirty, setDirty] = useState(false);

    // ========================
    // auth（统一入口）
    // ========================
    const getUserId = useCallback(async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) return null;
        return data.user.id;
    }, []);

    // ========================
    // fetch ratings（纯函数）
    // ========================

    const fetchRatings = useCallback(async () => {
    const user_id = await getUserId();
    if (!user_id) return {};

    // 1. 只查 rating（绝对稳定）
    const { data: ratings, error } = await supabase
        .from("rating")
        .select("song_id, rating, comment, updated_at, nickname")
        .eq("user_id", user_id);

    if (error) {
        console.error("fetchRatings error:", error);
        return {};
    }

    if (!ratings) return {};


    // 3. 查用户信息（安全方式：auth.getUser 不行，所以走 profile / metadata）
    const { data: authData } = await supabase.auth.getUser();

    const currentUser = authData?.user;

    const nickname =
        currentUser?.user_metadata?.username ||
        currentUser?.email ||
        currentUser?.id;

    // 4. 如果你只需要“当前用户评分列表”，其实直接用这个就够
    const map: Record<number, RatingRecord> = {};

    ratings.forEach((item) => {
        map[item.song_id] = {
            rating: item.rating,
            comment: item.comment,
            updatedAt: item.updated_at,

            // ⭐ 直接用当前用户昵称（最稳，不炸）
            nickname: nickname
        };
    });

    return map;
}, [getUserId]);

    // ========================
    // 初始化加载（修复 React warning）
    // ========================
    useEffect(() => {
        const load = async () => {
            const data = await fetchRatings();
            setRatingsMap(data);
        };

        load();
    }, [fetchRatings]);

    // ========================
    // 自动滚动
    // ========================
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentSongId]);

    // ========================
    // 保存评分（RLS安全）
    // ========================
    const saveRating = useCallback(async (
        songId: number,
        rating: number,
        comment: string
    ) => {
        const user_id = await getUserId();
        console.log("DEBUG user_id =", user_id);
        if (!user_id) return false;

        const { data: userData } = await supabase.auth.getUser();
const user = userData.user;

const nickname =
    user?.user_metadata?.username ??
    user?.user_metadata?.nickname ??
    user?.email ??
    "unknown";

console.log("FINAL nickname =", nickname);

const { error } = await supabase
    .from("rating")
    .upsert({
        user_id,
        song_id: songId,
        rating,
        comment,
        updated_at: new Date().toISOString(),
        nickname
    }, {
        onConflict: "user_id,song_id",
    });

        if (error) {
            console.error("saveRating error:", error);
            return false;
        }

        return true;
    }, [getUserId]);

    // ========================
    // 切歌
    // ========================
    const switchSong = useCallback(async (songId: number) => {

        const current = songs.find(s => s.id === currentSongId);
        if (!current) return;

        if (dirty) {
            const ok = confirm("当前评分尚未保存，是否保存？");

            if (ok) {
                await saveRating(current.id, editing.rating, editing.comment);
            } else {
                return;
            }
        }

        setCurrentSongId(songId);
        localStorage.setItem("currentSongId", String(songId));

        setDirty(false);

        const updated = await fetchRatings();
        setRatingsMap(updated);

        const record = updated[songId];

        setEditing({
            rating: record?.rating ?? 5,
            comment: record?.comment ?? "",
        });

    }, [currentSongId, dirty, editing, saveRating, fetchRatings]);

    // ========================
    // 上一首 / 下一首
    // ========================
    const goPrevSong = useCallback(async () => {
        if (currentSongId <= 1) return;
        await switchSong(currentSongId - 1);
    }, [currentSongId, switchSong]);

    const goNextSongSequential = useCallback(async () => {
        if (currentSongId >= songs.length - 1) return;
        await switchSong(currentSongId + 1);
    }, [currentSongId, switchSong]);

    // ========================
    // 随机未评分
    // ========================
    const getRandomUnratedSong = useCallback(() => {
        const list = songs.filter(s => s.id !== 0 && !ratingsMap[s.id]);

        if (list.length === 0) return null;

        return list[Math.floor(Math.random() * list.length)];
    }, [ratingsMap]);

    // ========================
    // 提交评分（最终安全版）
    // ========================
    const handleSubmit = useCallback(async () => {

        if (loadingNext) return;

        if (!dirty) {
            alert("你还没有修改评分");
            return;
        }

        setSubmitted(true);
        setLoadingNext(true);

        const user_id = await getUserId();

        if (!user_id) {
            alert("请先登录！");
            setSubmitted(false);
            setLoadingNext(false);
            return;
        }

        const success = await saveRating(
            currentSongId,
            editing.rating,
            editing.comment
        );

        if (!success) {
            alert("评分保存失败");
            setSubmitted(false);
            setLoadingNext(false);
            return;
        }

        setDirty(false);

        const updated = await fetchRatings();
        setRatingsMap(updated);

        const unRated = songs.filter(s => s.id !== 0 && !updated[s.id]);

        if (unRated.length > 0) {
            const next = unRated[Math.floor(Math.random() * unRated.length)];
            await switchSong(next.id);
        } else {
            alert("🎉 已完成全部评分！");
        }

        setSubmitted(false);
        setLoadingNext(false);

    }, [
        dirty,
        loadingNext,
        editing,
        currentSongId,
        saveRating,
        fetchRatings,
        switchSong,
        getUserId
    ]);

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
        dirty,
        setDirty,
    };
}