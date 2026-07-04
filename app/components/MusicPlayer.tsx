"use client";

import { useEffect, useRef, useState } from "react";
import { getAudioUrl } from "@/lib/audio";
import type { Song } from "@/data/songs";

interface MusicPlayerProps {
  song: Song;
  autoPlay?: boolean;
  variant?: "floating" | "inline";
  showVolume?: boolean;
  showTitle?: boolean;
}

export default function MusicPlayer({
  song,
  autoPlay = false,
  variant = "floating",
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // 音量变化
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 自动播放（如果浏览器允许）
  useEffect(() => {
    if (!autoPlay || !audioRef.current) return;

    audioRef.current.play().then(() => {
      setPlaying(true);
    }).catch(() => {});
  }, [autoPlay]);

  // 监听播放进度
useEffect(() => {
  const audio = audioRef.current;

  if (!audio) return;

  const updateProgress = () => {
    setProgress(audio.currentTime);
    setDuration(audio.duration || 0);
  };

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", updateProgress);

  return () => {
    audio.removeEventListener("timeupdate", updateProgress);
    audio.removeEventListener("loadedmetadata", updateProgress);
  };
}, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {}
    }
  };
  const handleProgressChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (!audioRef.current) return;

  const value = Number(e.target.value);

  audioRef.current.currentTime = value;

  setProgress(value);
};

  return (
    <>
      <audio
        ref={audioRef}
        src={getAudioUrl(song.audio)}
        loop
      />

      <div
  className="
rounded-2xl
border
border-stone-300/70
bg-white/75
backdrop-blur-md
p-4
shadow-lg
"
>

  {/* 标题 */}
  <div className="text-xs tracking-[0.3em] text-stone-500">

    ☯ NOW PLAYING

  </div>

  {/* 曲名 */}
  <div className="mt-3 text-xl font-semibold text-stone-800">

    {song.title}

  </div>

  {/* 作品名 */}
  <div className="mt-1 text-sm text-stone-500">

    {song.game}

  </div>

  {/* 副标题 */}
  <div className="italic text-xs text-stone-400">

    ～ {song.subimage} ～

  </div>

  {/* 分隔线 */}
  <div className="my-3 border-t border-stone-200" />

{/* 播放进度 */}
<div className="mb-4">

  <input
    type="range"
    min={0}
    max={duration || 0}
    value={progress}
    onChange={handleProgressChange}
    className="
      w-full
      accent-stone-600
    "
  />

</div>
  {/* 控制栏 */}
  <div className="flex items-center gap-4">

    {/* 播放按钮 */}

    <button
      onClick={togglePlay}
      className="
      h-9
      w-9
      rounded-full
      border
      border-stone-400
      transition
      hover:bg-stone-100
      "
    >

      {playing ? "❚❚" : "▶"}

    </button>

    {/* 音量 */}

    <span className="text-base">

      ♪

    </span>

    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={volume}
      onChange={(e) =>
        setVolume(Number(e.target.value))
      }
      className="
      flex-1
      accent-stone-600
      "
    />

  </div>

</div>

    </>
  );
}