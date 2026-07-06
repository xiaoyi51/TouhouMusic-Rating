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
  const [open, setOpen] = useState(false);

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

    {/* ================= PC端：保持原样 ================= */}
    <div className="hidden md:block">
      <div className="
        rounded-2xl
        border
        border-stone-300/70
        bg-white/75
        backdrop-blur-md
        p-4
        shadow-lg
      ">
        {/* ===== 原来UI完全不动 ===== */}

        <div className="text-xs tracking-[0.3em] text-stone-500">
          ☯ NOW PLAYING
        </div>

        <div className="mt-3 text-xl font-semibold text-stone-800">
          {song.title}
        </div>

        <div className="mt-1 text-sm text-stone-500">
          {song.game}
        </div>

        <div className="italic text-xs text-stone-400">
          ～ {song.subimage} ～
        </div>

        <div className="my-3 border-t border-stone-200" />

        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleProgressChange}
          className="w-full accent-stone-600 mb-4"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="h-9 w-9 rounded-full border border-stone-400 hover:bg-stone-100"
          >
            {playing ? "❚❚" : "▶"}
          </button>

          <span>♪</span>

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
    </div>

    {/* ================= 手机端：悬浮球 ================= */}
    <div className="md:hidden">
      
      {/* 悬浮按钮 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed z-50
            bottom-6 right-6
            w-14 h-14
            rounded-full
            bg-[#866477]
            text-white
            shadow-xl
            flex items-center justify-center
          "
        >
          ▶
        </button>
      )}

      {/* 展开播放器 */}
      {open && (
        <div
          className="
            fixed z-50
            bottom-6 left-4 right-4
            rounded-2xl
            border
            border-stone-300/70
            bg-white/90
            backdrop-blur-md
            p-4
            shadow-xl
          "
        >
          {/* 关闭按钮 */}
          <div className="flex justify-between mb-2">
            <div className="text-xs text-stone-500">NOW PLAYING</div>

            <button
              onClick={() => setOpen(false)}
              className="text-sm text-stone-500"
            >
              ✕
            </button>
          </div>

          <div className="text-lg font-semibold">{song.title}</div>
          <div className="text-xs text-stone-500">{song.game}</div>

          <div className="my-2 border-t border-stone-200" />

          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleProgressChange}
            className="w-full accent-stone-600 mb-3"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="h-8 w-8 rounded-full border"
            >
              {playing ? "❚❚" : "▶"}
            </button>

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
      )}
    </div>
  </>
);
}