"use client";

import { useEffect, useRef, useState } from "react";
import { Song } from "@/data/songs";

interface Props {
    song: Song;
}

export default function RatingMusicPlayer({ song }: Props) {

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [showVolume, setShowVolume] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [playing, setPlaying] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);

    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(1);
    useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.src = song.audio;
    audio.load();

    setPlaying(false);
    setCurrentTime(0);
}, [song.audio]);

    // 播放暂停

    const togglePlay = () => {

        if (!audioRef.current) return;

        if (playing) {

            audioRef.current.pause();

        } else {

            audioRef.current.play();

        }

        setPlaying(!playing);

    };

    // 时间更新

    useEffect(() => {

        const audio = audioRef.current;

        if (!audio) return;

        const update = () => {
            if (!isDragging) 
            setCurrentTime(audio.currentTime);

        };

        const loaded = () => {

            setDuration(audio.duration);

        };
        const ended = () => {

        setPlaying(false);};

        audio.addEventListener("timeupdate", update);
        audio.addEventListener("ended", ended);
        audio.addEventListener("loadedmetadata", loaded);

        return () => {

            audio.removeEventListener("timeupdate", update);
            audio.removeEventListener("ended", ended);
            audio.removeEventListener("loadedmetadata", loaded);

        };

    }, []);

    // 时间格式
    const updateProgress = (clientX: number) => {

    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();

    const percent = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1
    );

    const time = percent * duration;

    audioRef.current.currentTime = time;

    setCurrentTime(time);

};
    const formatTime = (time: number) => {

        if (isNaN(time)) return "00:00";

        const m = Math.floor(time / 60);

        const s = Math.floor(time % 60);

        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    };

    return (

        <div className="w-full max-w-140">

            <audio

                ref={audioRef}

                src={song.audio}

            />

            {/* 第一行 */}

            <div className="flex items-center gap-5">

                {/* 播放按钮 */}

                <button

                    onClick={togglePlay}

                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b79b92] text-[#8d6d78] transition hover:bg-[#f3efeb]"

                >

                    {playing ? "❚❚" : "▶"}

                </button>

                {/* 进度条 */}

                <div
    ref={progressRef}
    className="relative h-0.5 flex-1 cursor-pointer rounded-full bg-[#d9d0cb]"

    onClick={(e) => updateProgress(e.clientX)}

    onMouseDown={(e) => {

        setIsDragging(true);

        updateProgress(e.clientX);

        const move = (ev: MouseEvent) => {

            updateProgress(ev.clientX);

        };

        const up = () => {

            setIsDragging(false);

            window.removeEventListener("mousemove", move);

            window.removeEventListener("mouseup", up);

        };

        window.addEventListener("mousemove", move);

        window.addEventListener("mouseup", up);

    }}
>

    {/* 已播放 */}

    <div
        className="absolute left-0 top-0 h-full rounded-full bg-[#8d6d78]"
        style={{
    width: `${currentTime/duration*100}%`
}}
    />

    {/* 圆点 */}

    <div
        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#8d6d78]"
        style={{
    left: duration
        ? `calc(${(currentTime / duration) * 100}% - 6px)`
        : "-6px"
}}
    />

</div>

                {/* 音量 */}

                <div className="relative">

    <button
        onClick={() => setShowVolume(!showVolume)}
        className="text-xl text-[#8d6d78] hover:scale-110 transition"
    >
        🔊
    </button>

    {showVolume && (

        <div
            className="absolute right-0 top-8 rounded-xl border border-[#ddd] bg-white  p-2  shadow-lg
            "
        >

            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    if (audioRef.current) {
                        audioRef.current.volume = v;
                    }
                }}
                className="accent-[#8d6d78]"
            />
        </div>
    )}

</div>

            </div>

            {/* 第二行 */}

            <div className="mt-2 flex justify-between text-xs tracking-wide text-[#8d8178]">

                <span>

                    {formatTime(currentTime)}

                </span>

                <span>

                    {formatTime(duration)}

                </span>
            </div>
        </div>
    );
}