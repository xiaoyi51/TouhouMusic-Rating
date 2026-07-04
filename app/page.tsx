import Image from "next/image";
import BackgroundDecoration from "./components/BackgroundDecorations";
import Link from "next/link";
import MusicPlayer from "./components/MusicPlayer";
import { songs } from "@/data/songs";
export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      {/* 背景纹样 */}
      <BackgroundDecoration />

  <div className="fixed left-6 bottom-6 z-50 w-64">
    <MusicPlayer song={songs[0]} autoPlay />
</div>
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-8 py-16 text-center">

        {/* 顶部标题 */}
        <p className="text-sm uppercase tracking-[0.4em] text-stone-500">
          Touhou Music Rating Project
        </p>

        <h1 className="mt-3 text-5xl font-semibold">
          东方原曲鉴赏计划
        </h1>

        {/* 分割线 */}
        <div className="my-12 w-full border-t border-stone-300"></div>

        {/* 欢迎 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">
            欢迎参加东方原曲鉴赏活动
          </h2>

          <div className="space-y-3 text-lg leading-9 text-stone-700">
            <p>在这里，你将随机欣赏东方Project原曲，</p>
            <p>并按照自己的第一印象进行评分。</p>

            <br />

            <p>无论是否了解东方，</p>
            <p>都欢迎留下最真实的感受。</p>
          </div>
        </section>

        {/* 分割线 */}
        <div className="my-12 w-full border-t border-stone-300"></div>

        {/* 东方介绍 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">
            什么是东方Project？
          </h2>

          <div className="space-y-3 text-lg leading-8 text-stone-700">
            <p>
              东方Project 是由 ZUN以上海爱丽丝幻乐团（一人社团）
            </p>
            <p>
              为名义创作的同人游戏系列,
            </p>
            <p>
              讲述了一个由大结界包围着的，与外部世界相联系
            </p>
            <p>
              却又不同的独立生态系统的 “幻想乡”中
            </p>
            <p>
              人类、妖怪、神明之间不可思议的故事。
            </p>

            <p>
              从1996年到2026年，已经拥有数量众多、风格鲜明的原创音乐。
            </p>
            <p>
              （大多由ZUN一人完成）
            </p>

            <br />

            <p>
              本活动将选取其中的200+首原曲，
            </p>
            <p>
               主要包括封面曲、结尾曲、道中曲（正作分为道中关和boss关）、角色曲（boss关）、音乐CD曲等
            </p>

            <p>
              邀请你进行评分鉴赏。
            </p>
          </div>

          <a
            href="https://thbwiki.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block pt-2 text-stone-600 transition hover:text-black hover:underline"
          >
            了解更多 →
          </a>
        </section>

        {/* 分割线 */}
        <div className="my-12 w-full border-t border-stone-300"></div>

        {/* 开始按钮 */}
        <Link href="/login">
        <button
          className="
            rounded-md
            border
            border-stone-400
            px-10
            py-3
            text-lg
            transition
            hover:bg-stone-100
          "
        >
          开始今天的鉴赏
        </button>
        </Link>

        {/* Footer */}
        <footer className="mt-20 text-sm text-stone-500">
          © Touhou Music Rating Project
        </footer>

      </div>
    </main>
  );
}
