"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadState } from "@utils/storage";

export default function HomePage() {
  const router = useRouter();
  const [hint, setHint] = useState<string>("先建立成員，之後再記錄支出～");

  useEffect(() => {
    const state = loadState();
    if (!state || state.members.length === 0) {
      setHint("先建立成員，之後再記錄支出～");
    } else if (state.expenses.length === 0) {
      setHint("已有成員，可以開始新增支出囉！");
    } else {
      setHint("已有支出，隨時可以查看結算結果 ✨");
    }
  }, []);

  const handleStart = () => {
    const state = loadState();
    if (!state || state.members.length === 0) {
      router.push("/members");
    } else if (state.expenses.length === 0) {
      router.push("/expenses");
    } else {
      router.push("/result");
    }
  };

  return (
    <section className="card p-6 mt-6 flex flex-col items-center text-center gap-4">
      <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-spritePink via-spriteMint to-spriteSky flex items-center justify-center text-4xl shadow-soft-card">
        ✨
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-spriteText">
          一鍵開始今天的分帳
        </h2>
        <p className="text-xs text-spriteText/70 max-w-xs mx-auto">
          把和朋友的每一筆小回憶，都交給 SplitSprite
          幫你算好，不再煩惱誰還欠誰。
        </p>
      </div>
      <button
        type="button"
        onClick={handleStart}
        className="mt-1 w-full rounded-2xl bg-gradient-to-r from-spritePink via-spriteLavender to-spriteSky py-3 text-sm font-semibold text-slate-700 shadow-soft-card active:scale-[0.98] transition"
      >
        開始分帳
      </button>
      <p className="text-[11px] text-spriteText/60">{hint}</p>
    </section>
  );
}


