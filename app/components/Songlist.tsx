import { songs } from "@/data/songs";
import type { RatingRecord } from "@/data/rating";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { supabase } from "@/lib/supabase";
console.log(supabase);

type SongListProps = {
    ratingsMap: Record<number, RatingRecord>;
    currentSongId: number;
    switchSong: (songId: number) => void;
    onSelect?: () => void;
};

export default function SongList({
    ratingsMap,
    currentSongId,
    switchSong,
    onSelect,
}: SongListProps) {

    const groupedSongs = songs
        .filter(song => song.id !== 0)
        .reduce((acc, song) => {
            const key = `${song.release} ${song.game}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(song);
            return acc;
        }, {} as Record<string, typeof songs>);

    const [expandedGroups, setExpandedGroups] =
        useState<Record<string, boolean>>({});

    const initializedRef = useRef(false);

    useEffect(() => {
    if (initializedRef.current) return;

    const initial: Record<string, boolean> = {};
    Object.entries(groupedSongs).forEach(([key, groupSongs]) => {

        const ratedCount = groupSongs.filter(
            song => ratingsMap[song.id]
        ).length;

        // 全部评分完成 → 默认收起
        initial[key] = ratedCount !== groupSongs.length;

    });

    setExpandedGroups(initial);
    initializedRef.current = true;

}, [groupedSongs, ratingsMap]);

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
            {Object.entries(groupedSongs).map(([groupName, groupSongs]) => {

                const ratedCount =
                    groupSongs.filter(song => ratingsMap[song.id]).length;

                const totalCount = groupSongs.length;

                return (
                    <div key={groupName}>

                        {/* 分组标题 */}
                        <div
                            onClick={() =>
                                setExpandedGroups(prev => ({
                                    ...prev,
                                    [groupName]: !prev[groupName],
                                }))
                            }
                            className="
                                cursor-pointer
                                px-3 py-2 mt-4
                                rounded
                                bg-stone-100/50
                                hover:bg-stone-200/50
                                flex items-center
                            "
                        >
                            <span className="mr-2">
                                {expandedGroups[groupName] ? "▼" : "▶"}
                            </span>

                            <span className="font-semibold text-[#7d6174]">
                                {groupName}
                            </span>

                            <span
                                className={`ml-auto text-sm font-medium ${
                                    ratedCount === totalCount
                                        ? "text-emerald-600"
                                        : ratedCount === 0
                                        ? "text-stone-400"
                                        : "text-[#9a7086]"
                                }`}
                            >
                                {ratedCount} / {totalCount}
                            </span>
                        </div>

                        {/* 歌曲列表 */}
                        {expandedGroups[groupName] &&
                            groupSongs
                                .filter(song => song.id !== 0)
                                .map((song, index) => {

                                    const record = ratingsMap[song.id];
                                    const rated = !!record;
                                    const current = song.id === currentSongId;

                                    const preview =
                                        record?.comment?.length
                                            ? record.comment.length > 30
                                                ? record.comment.slice(0, 30) + "..."
                                                : record.comment
                                            : "暂无评语";

                                    return (
                                        <div
                                            key={song.id}
                                            onClick={() => {
                                                switchSong(song.id);
                                                onSelect?.();
                                            }}
                                            className={`
                                                p-3 border-b cursor-pointer
                                                hover:bg-stone-50
                                                ${current ? "bg-stone-100 border-l-4 border-[#9a7086]" : ""}
                                            `}
                                        >
                                            {/* 歌曲名 */}
                                            <div className="font-medium flex items-center gap-2">
                                                <span className="text-stone-400 mr-2">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>

                                                <span className={rated ? "text-[#9a7086]" : "text-stone-400"}>
                                                    {rated ? "●" : "○"}
                                                </span>

                                                {song.translation}
                                            </div>

                                            {/* 分数 */}
                                            <div className="text-sm text-stone-600 flex items-center gap-2">
                                                {rated ? (
                                                    <>
                                                        <span className="text-[#9a7086] font-medium">
                                                            {record.rating.toFixed(2)}
                                                        </span>
                                                        <span className="text-xs text-stone-400">
                                                            / 10
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-stone-400">未评分</span>
                                                )}
                                            </div>

                                            {/* 评论 */}
                                            <div className="text-xs text-stone-500">
                                                {preview}
                                            </div>
                                        </div>
                                    );
                                })}
                    </div>
                );
            })}
        </div>
    );
}