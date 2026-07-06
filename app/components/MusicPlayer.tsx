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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!autoPlay || !audioRef.current) return;

    audioRef.current.play().then(() => {
      setPlaying(true);
    }).catch(() => {});
  }, [autoPlay]);

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

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  return (
    <>
      <audio ref={audioRef} src={getAudioUrl(song.audio)} loop />

      <div
        className="
          rounded-2xl
          border
          border-stone-300/70
          bg-white/75
          backdrop-blur-md
          p-4
          shadow-lg

          /* ✅ 手机端优化 */
          w-full
          max-w-[420px]
          md:max-w-none
          mx-auto
          md:mx-0
        "
      >
        {/* 标题（手机缩小） */}
        <div className="text-[10px] md:text-xs tracking-[0.3em] text-stone-500">
          ☯ NOW PLAYING
        </div>

        {/* 曲名 */}
        <div className="mt-2 md:mt-3 text-lg md:text-xl font-semibold text-stone-800">
          {song.title}
        </div>

        {/* 作品名 */}
        <div className="mt-1 text-xs md:text-sm text-stone-500">
          {song.game}
        </div>

        {/* 副标题（手机隐藏，避免占空间） */}
        <div className="hidden md:block italic text-xs text-stone-400">
          ～ {song.subimage} ～
        </div>

        <div className="my-3 border-t border-stone-200" />

        {/* 进度条（手机更紧凑） */}
        <div className="mb-3 md:mb-4">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleProgressChange}
            className="w-full accent-stone-600"
          />
        </div>

        {/* 控制栏（手机压缩 spacing） */}
        <div className="flex items-center gap-3 md:gap-4">

          <button
            onClick={togglePlay}
            className="
              h-8 w-8 md:h-9 md:w-9
              rounded-full
              border border-stone-400
              transition
              hover:bg-stone-100
            "
          >
            {playing ? "❚❚" : "▶"}
          </button>

          <span className="text-sm md:text-base">♪</span>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 accent-stone-600"
          />
        </div>
      </div>
    </>
  );
}