"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BottomNav } from "@components/BottomNav";
import { Member, MemberColor, SplitState } from "@types/index";
import { loadState, saveState } from "@utils/storage";

const colorOptions: MemberColor[] = [
  "spritePink",
  "spriteMint",
  "spriteYellow",
  "spriteLavender",
  "spriteSky"
];

const emojiPresets = ["😀", "😆", "😎", "🧸", "🐱", "🐶", "🐰", "🐼", "🍓", "🍑"];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("😀");
  const [color, setColor] = useState<MemberColor>("spritePink");

  useEffect(() => {
    const state = loadState();
    if (state?.members) {
      setMembers(state.members);
    }
  }, []);

  useEffect(() => {
    const base: SplitState = {
      members,
      expenses: [],
      discount: { totalDiscount: 0 }
    };
    saveState(base);
  }, [members]);

  const canSubmit = useMemo(
    () => name.trim().length > 0,
    [name]
  );

  const handleAdd = () => {
    if (!canSubmit) return;
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const newMember: Member = {
      id,
      name: name.trim(),
      emoji,
      color
    };
    setMembers((prev) => [...prev, newMember]);
    setName("");
  };

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <>
      <section className="card p-4 pb-5">
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          🧑‍🤝‍🧑 成員管理
        </h2>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="text-2xl rounded-2xl bg-white/80 px-3 py-2 shadow-soft-card"
            >
              {emoji}
            </button>
            <div className="grid grid-cols-5 gap-1">
              {emojiPresets.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`rounded-xl py-1 text-xl ${
                    emoji === e ? "bg-spritePink/80" : "bg-white/70"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <input
              className="flex-1 rounded-xl border border-spritePink/50 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-spritePink/80"
              placeholder="成員暱稱"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center justify-between">
            <span className="text-xs text-spriteText/60">主題色</span>
            <div className="flex gap-1">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 ${
                    c === "spritePink"
                      ? "bg-spritePink"
                      : c === "spriteMint"
                      ? "bg-spriteMint"
                      : c === "spriteYellow"
                      ? "bg-spriteYellow"
                      : c === "spriteLavender"
                      ? "bg-spriteLavender"
                      : "bg-spriteSky"
                  } ${
                    color === c ? "border-slate-700" : "border-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleAdd}
            className={`w-full rounded-xl py-2.5 text-sm font-semibold shadow-soft-card transition ${
              canSubmit
                ? "bg-spriteMint hover:bg-spriteMint/90 text-slate-700"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            ➕ 新增成員
          </button>
        </div>
      </section>

      <section className="card p-4 mb-24 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-spriteText/80">
            已加入的朋友
          </h3>
          <span className="pill">共 {members.length} 人</span>
        </div>
        {members.length === 0 ? (
          <p className="text-xs text-spriteText/60">
            先新增幾位朋友，之後就可以開始記錄支出了 ✨
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleRemove(m.id)}
                className="group relative"
              >
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium shadow-soft-card border border-white/70 bg-gradient-to-r from-spritePink/70 via-spriteYellow/70 to-spriteMint/70 text-spriteText">
                  <span className="text-base">{m.emoji}</span>
                  <span>{m.name}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        <Link
          href="/expenses"
          className={`mt-1 block w-full rounded-xl py-2.5 text-xs text-center font-semibold shadow-soft-card transition ${
            members.length === 0
              ? "bg-slate-200 text-slate-400 pointer-events-none"
              : "bg-spriteMint/90 text-slate-700 hover:bg-spriteMint"
          }`}
        >
          下一步：記錄支出 →
        </Link>
      </section>

      <BottomNav />
    </>
  );
}
