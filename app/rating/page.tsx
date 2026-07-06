"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import RatingMusicPlayer from "../components/RatingMusicPlayer";
import { songs } from "@/data/songs";
import { useRating } from "@/hooks/useRating";
import SongList from "../components/Songlist";
import {Sheet,SheetContent,SheetHeader,SheetTitle,} from "@/components/ui/sheet";
export default function RatingPage() {

    const {
    song,
    editing,
    setEditing,
    submitted,
    loadingNext,
    handleSubmit,
    switchSong,
    currentSongId,
    finishedCount,
    totalCount,
    goPrevSong,
    goNextSongSequential,
    ratingsMap,
    setDirty,
    infoOpen, setInfoOpen,
} = useRating();
const [songListOpen, setSongListOpen] = useState(false);

    return (

        <main className="min-h-screen bg-[#f8f6f2]">

    {/* ================= Header ================= */}

    <header className="relative border-b border-[#e8ddd2] bg-[#f8f6f2]">

        <div className="mx-auto max-w-6xl py-10 text-center">
            <div className="absolute right-8 top-8 flex items-center gap-3">
</div>

            {/* 英文标题 */}

            <p className="text-sm tracking-[0.18em] text-[#8d8178] font-serif">

                Touhou Music Rating Project

            </p>

            {/* 中文标题 */}

            <h1 className="mt-3 text-5xl font-serif font-semibold tracking-[0.12em] text-[#3f3432]">

                东方原曲鉴赏计划

            </h1>
            <div className="mt-4 text-sm tracking-wide text-[#7d6d62]">
    已完成
    <span className="mx-1 font-semibold text-[#564742]">
        {finishedCount}
    </span>
    /
    <span className="mx-1">
        {totalCount}
    </span>
</div>

            {/* 装饰线 */}

            <div className="mt-5 flex justify-center items-center gap-4">

                <div className="h-px w-20 bg-[#cbb8a9]" />

                <div className="h-1.5 w-1.5 rotate-45 bg-[#cbb8a9]" />

                <div className="h-px w-20 bg-[#cbb8a9]" />
            </div>
        </div>
    </header>
    {/* ================= Main ================= */}
    <div className="mx-auto max-w-6xl px-4 sm:px-8 py-6 sm:py-10">

        {/* ================= Main Card ================= */}
        <section className="rounded-[28px] border border-[#eadfd5] bg-white/75 shadow-[0_8px_30px_rgba(70,50,40,0.08)] backdrop-blur-sm p-10">

            {/* ================= Progress ================= */}
            <div className="relative flex items-center justify-center mb-12">

                {/* 中间进度 */}

                <div className="flex items-center gap-5">

                    <div className="flex items-center gap-3">

                        <div className="h-px w-20 bg-[#ccb9aa]" />

                        <div className="h-1.5 w-1.5 rotate-45 bg-[#ccb9aa]" />

                    </div>

                    <span className="text-2xl font-serif text-[#6c5d56] tracking-wide">
                        <span className="text-2xl font-serif text-[#6c5d56] tracking-wide">
    第 {currentSongId} / {songs.length-1} 首
</span>
                    </span>

                    <div className="flex items-center gap-3">

                        <div className="h-1.5 w-1.5 rotate-45 bg-[#ccb9aa]" />

                        <div className="h-px w-20 bg-[#ccb9aa]" />

                    </div>

                </div>

                {/* 曲库按钮 */}
                <button
    onClick={() => setSongListOpen(true)}
    className="
        absolute
        right-0
        top-1/2
        -translate-y-1/2
        flex items-center gap-2
        rounded-xl
        border border-[#d8c9bc]
        bg-white/80
        px-4 py-2
        text-sm
        font-medium
        text-[#5a4d48]
        shadow-sm
        transition-all
        hover:bg-[#f3eee8]
        hover:border-[#bda999]
    "
>
    <span className="text-base">☰</span>
    曲库
</button>

            </div>
            <Link href="/profile">
  <button className="ml-4 text-stone-600 underline">
    个人中心
  </button>
</Link>
{/* ================= Hero ================= */}

<section className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-14 items-center">

    {/* ---------- 左侧角色立绘 ---------- */}

<div className="
    relative
    flex
    h-72 sm:h-90
    w-full sm:w-[320px]
    items-end
    justify-center
    overflow-hidden
    rounded-2xl
    border
    border-[#eadfd5]
    bg-[#faf8f4]
    shadow-md
">
    <div className="absolute bottom-0 h-40 w-40 rounded-full bg-[#eadfd5] blur-3xl opacity-60" />
    <Image
        src={song.image}
        alt={song.title}
        fill
        sizes="320px"
        priority
        className="
            object-contain
            object-bottom
            p-4
            select-none
            pointer-events-none
        "
    />
</div>
    {/* ---------- 右侧 ---------- */}

    <div className="flex h-full flex-col justify-start pt-2 sm:pt-4">

        {/* 曲名 */}

        <h2 className="font-serif text-2xl sm:text-[42px] font-semibold leading-tight text-[#3f3432]">

            {song.title}

        </h2>

        {/* 游戏出处 */}

        <p className="mt-3 text-xl italic tracking-wide text-[#8b8078]">

            出自游戏：{song.game}

        </p>

        {/* 中文译名 */}

        <p className="mt-2 text-sm text-[#a0948d]">

            中文译名：{song.translation}

        </p>

        {/* 播放器 */}

        <div className="mt-10 max-w-140">

    <RatingMusicPlayer  song={song}/>

</div>

    </div>

</section>

{/* Hero结束后的分隔 */}

<div className="my-12 h-px bg-[#ece3db]" />
{/* ================= Song Detail ================= */}

<section className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">

    {/* ================= 左侧：歌曲信息 ================= */}

    <div
        className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-[#eadfd5]
            bg-[#fffdfb]
            p-8
            shadow-[0_8px_28px_rgba(80,60,50,.06)] flex-1 min-w-0
        "
    >
        {/* 标题 */}

        <h3 className="flex items-center gap-2 font-serif text-2xl text-[#5a4943]">

            <span className="text-xl text-[#c58b97]">♪</span>

            歌曲信息

        </h3>

        <div className="mt-4 h-px bg-[#ece2d8]" />

        {/* 基本信息 */}

        <div className="mt-6 space-y-4 text-[15px] leading-7 text-[#645954]">

            <div className="flex">

                <span className="w-24 text-[#9b8f87]">

                    出自作品

                </span>

                <span>{song.game}</span>

            </div>

            <div className="flex">

                <span className="w-24 text-[#9b8f87]">

                    发布时间

                </span>

                <span>{song.release}</span>

            </div>

            <div className="flex">

                <span className="w-24 text-[#9b8f87]">

                    作曲

                </span>

                <span>{song.composer}</span>

            </div>

            <div className="flex items-start">

                <span className="w-24 text-[#9b8f87]">

                    主题角色

                </span>

                <span>

                    {song.character.join("、")}

                </span>

            </div>

        </div>

   {/* 曲目简介 */}
<div className="mt-10">

    <h4 className="flex items-center gap-2 text-lg font-semibold text-[#5d4c46]">
        <span className="text-[#c58b97]">ⓘ</span>
        曲目简介
    </h4>

    {/* 关键：只包内容，不改结构 */}
    <div className="relative mt-4">

        {/* 内容本体 */}
        <div className="space-y-5">
            {song.description.map((paragraph, index) => (
                <p
                    key={index}
                    className="indent-[2em] leading-9 text-[15px] text-[#5d544d] tracking-normal whitespace-pre-line text-left"
                >
                    {paragraph}
                </p>
            ))}
        </div>

        {/* 遮罩（只覆盖，不参与布局） */}
        {!infoOpen.song && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                <button
                    onClick={() =>
                        setInfoOpen(prev => ({ ...prev, song: true }))
                    }
                    className="px-4 py-2 rounded-xl bg-[#866477] text-white text-sm shadow"
                >
                    查看曲目简介
                </button>
            </div>
        )}

    </div>
</div>

        {/* 底部装饰 */}

        <div
            className="
                pointer-events-none
                absolute
                bottom-4
                right-6
                text-[90px]
                text-pink-200/20
                select-none
            "
        >
            ❀
        </div>
</div>

    {/* ================= 右侧：相关角色 ================= */}

    <div
        className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-[#eadfd5]
            bg-[#fffdfb]
            p-8
            shadow-[0_8px_28px_rgba(80,60,50,.06)]  flex-1 min-w-0
        "
    >

        <h3 className="flex items-center gap-2 font-serif text-2xl text-[#5a4943]">

            <span className="text-[#c58b97]">

                👤

            </span>

            相关角色

        </h3>

        <div className="mt-4 h-px bg-[#ece2d8]" />

        {/* 人物展示 */}

        <div
            className="
                relative
                mt-6
                flex
                h-80
                items-end
                justify-center
            "
        >
            {/* 光晕 */}

            <div
                className="
                    absolute
                    bottom-6
                    h-44
                    w-44
                    rounded-full
                    bg-[#eadfd5]
                    opacity-40
                    blur-3xl
                "
            />

            <Image
                src={song.subimage}
                alt={song.character[0]}
                fill
                sizes="400px"
                className="
                    object-contain
                    object-bottom
                    p-4
                "

            />

        </div>

        {/* 名称 */}

        <h4
            className="
                mt-5
                text-center
                text-xl
                font-semibold
                text-[#51433d]
            "
        >

            {song.character.join("、")}

        </h4>
{/* 人物简介 */}
<div className="relative mt-6">

    <div className="space-y-5">
        {song.introduction.map((paragraph, index) => (
            <p
                key={index}
                className="indent-[2em] leading-9 text-[15px] text-[#5d544d] tracking-normal whitespace-pre-line text-left"
            >
                {paragraph}
            </p>
        ))}
    </div>

    {!infoOpen.character && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
            <button
                onClick={() =>
                    setInfoOpen(prev => ({ ...prev, character: true }))
                }
                className="px-4 py-2 rounded-xl bg-[#866477] text-white text-sm shadow"
            >
                查看人物介绍
            </button>
        </div>
    )}

</div>

        {/* 装饰 */}

        <div
            className="
                absolute
                right-5
                top-5
                text-5xl
                text-[#eadfd5]/30
                select-none
            "
        >

            ☯
        </div>
    </div>
</section>
{/* ================= Rating Panel ================= */}

<section className="mt-12 overflow-hidden rounded-3xl border border-[#eadfd5] bg-[#fffdfb] shadow-[0_8px_28px_rgba(80,60,50,.06)]">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
    {/* ================= 左侧：评分 ================= */}

    <div
        className="
            p-8
        "
    >
        {/* 标题 */}

        <h3 className="flex items-center gap-2 text-2xl font-serif text-[#5a4943]">

            <span className="text-[#c58b97]">★</span>

            请为这首曲目评分

        </h3>
       

        <div className="mt-4 h-px bg-[#ece2d8]" />

        {/* 当前分数 */}

        <div className="mt-8 text-center">

            <p className="text-4xl sm:text-6xl font-bold text-[#403735]">

                {editing.rating.toFixed(2)}

            </p>

            <p className="mt-2 text-sm text-[#9b8f87]">

                点击刻度或拖动滑块进行评分（可保留两位小数）

            </p>

        </div>

        {/* 滑块 */}

        <div className="mt-10">

            <input
            type="range"
             min={0}
             max={10}
             step={0.01}
             value={Number(editing.rating) || 0}
             onChange={(e) =>{
                setDirty(true);
                setEditing((prev) => ({
                     ...prev,
                     rating: Number(e.target.value),
    }))
             }}
  className="h-2 w-full cursor-pointer accent-[#9a7086] relative z-50"
/>

            {/* 刻度 */}

            <div className="mt-3 flex justify-between text-xs text-[#8f837c]">

                {[0,1,2,3,4,5,6,7,8,9,10].map((n)=>(

                    <span key={n}>{n}</span>

                ))}

            </div>

        </div>

        {/* 输入框 */}

        <div className="mt-8">

            <label className="text-sm text-[#8f837c]">

                或直接输入分数：

            </label>

            <input

                type="number"

                min={0}

                max={10}

                step={0.01}

                value={editing.rating}

                onChange={(e)=>{

                    let value = Number(e.target.value);
                    if(isNaN(value)) return;
                    value=Math.min(10,Math.max(0,value));
                    
                    setEditing(prev => ({
    ...prev,
    rating: Number(value.toFixed(2)),
}));

                }}

                className="
                    mt-2
                    w-28
                    rounded-lg
                    border
                    border-[#ddd1c8]
                    px-3
                    py-2
                    text-center
                    outline-none
                    focus:border-[#b98fa1]
                "

            />

        </div>
<div className="relative p-8">

    <div
        className="
            absolute
            left-0
            top-10
            bottom-10
            w-px
            bg-linear-to-b
            from-transparent
            via-[#e8ddd2]
            to-transparent
        "
    />
    </div>

    {/* ================= 右侧：评论 ================= */}

    <div
        className="
            p-8
        "
    >

        <h3 className="flex items-center gap-2 text-2xl font-serif text-[#5a4943]">

            <span className="text-[#c58b97]">💬</span>

            留下你的评语

        </h3>

        <div className="mt-4 h-px bg-[#ece2d8]" />

        <div className="mt-6">

            <textarea

                maxLength={300}

                value={editing.comment}

                onChange={(e)=>{
                    setDirty(true);
                    setEditing(prev => ({
    ...prev,
    comment: e.target.value,
}))}}

                placeholder="写下你对这首曲目的第一印象吧..."

                className="
                    h-60
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-[#ddd1c8]
                    bg-[#fffdfa]
                    p-5
                    leading-7
                    text-[#574d49]
                    outline-none
                    transition
                    placeholder:text-[#b7ada8]
                    focus:border-[#b98fa1]
                    focus:ring-2
                    focus:ring-[#f1dbe6]
                "

            />

            <div className="mt-2 text-right text-sm text-[#9b8f87]">

                {editing.comment.length} / 300

            </div>

        </div>

    </div>
    </div>
    </section>
    {/* ================= Submit ================= */}

<section className="mt-16 mb-24">

    {/* 装饰线 */}

    <div className="mb-10 flex items-center justify-center gap-5">

        <div className="h-px w-28 bg-[#ddd2c8]" />

        <div className="h-2 w-2 rotate-45 border border-[#ccb9aa] bg-[#f8f4ef]" />

        <div className="h-px w-28 bg-[#ddd2c8]" />

    </div>
    <div className="mt-10 flex justify-between">

    <button
        onClick={goPrevSong}
        disabled={currentSongId === 1}
        className="
            rounded-xl
            border
            border-[#d8c9bc]
            bg-white
            px-5
            py-2.5
            text-sm
            transition
            hover:bg-[#f5f1ec]
            disabled:cursor-not-allowed
            disabled:opacity-40
        "
    >
        ← 上一首
    </button>

    <button
        onClick={goNextSongSequential}
        disabled={currentSongId === songs.length - 1}
        className="
            rounded-xl
            border
            border-[#d8c9bc]
            bg-white
            px-5
            py-2.5
            text-sm
            transition
            hover:bg-[#f5f1ec]
            disabled:cursor-not-allowed
            disabled:opacity-40
        "
    >
        下一首 →
    </button>

</div>

    {/* 提交按钮 */}

    <div className="flex justify-center">

        <button
            onClick={handleSubmit}
            disabled={loadingNext}
            className="
                group
                flex
                w-full
                max-w-180
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-[#866477]
                px-10
                py-5
                text-lg
                font-medium
                tracking-[0.08em]
                text-white
                shadow-[0_10px_24px_rgba(120,90,105,.18)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#7a5a6b]
                hover:shadow-[0_14px_34px_rgba(120,90,105,.28)]
                active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed
            "
        >

            <span
                className="
                    text-xl
                    transition-all
                    duration-500
                    group-hover:rotate-12
                    group-hover:scale-110
                "
            >
                ✦
            </span>

            <span>
                {submitted ? (
    <>
        ✓ 已提交
    </>
) : (
    <>
        ✦ 提交并随机下一首
    </>
)}
            </span>
        </button>
    </div>

    {/* 感谢语 */}

    <div
        className="
            mt-8
            text-center
            text-sm
            leading-7
            tracking-wide
            text-[#8f837c]
        "
    >

        感谢你的参与！你的每一次评价都将帮助我们更了解东方音乐的魅力。

        <span className="ml-1 text-[#d6a6b8]">

            ❀

        </span>

    </div>

</section>
     </section>            
</div>
<Sheet open={songListOpen} onOpenChange={setSongListOpen}>
    <SheetContent
        side="right"
        className="w-105 p-0"
    >
        <SheetHeader className="border-b px-6 py-4">
            <SheetTitle>
                曲库
            </SheetTitle>
        </SheetHeader>

        <SongList
            ratingsMap={ratingsMap}   // ✅ 核心改动
            currentSongId={currentSongId}
            switchSong={switchSong}
            onSelect={() => setSongListOpen(false)}
        />
    </SheetContent>
</Sheet>
</main>

    );
}


