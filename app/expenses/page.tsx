"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BottomNav } from "@components/BottomNav";
import { Member, Expense, SplitState } from "@types/index";
import { loadState, saveState } from "@utils/storage";
import { MemberBadge } from "@components/MemberBadge";

export default function ExpensesPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    const state = loadState();
    if (state) {
      setMembers(state.members || []);
      setExpenses(state.expenses || []);
    }
  }, []);

  useEffect(() => {
    const base: SplitState = {
      members,
      expenses,
      discount: loadState()?.discount ?? { totalDiscount: 0 }
    };
    saveState(base);
  }, [members, expenses]);

  const canSubmit = useMemo(() => {
    const amt = Number(amount);
    return (
      title.trim().length > 0 &&
      !Number.isNaN(amt) &&
      amt > 0 &&
      payerId &&
      participants.length > 0
    );
  }, [title, amount, payerId, participants]);

  const toggleParticipant = (id: string) => {
    setParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (!canSubmit) return;
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const expense: Expense = {
      id,
      title: title.trim(),
      amount: Number(amount),
      payerId,
      participantIds: participants,
      createdAt: new Date().toISOString()
    };
    setExpenses((prev) => [expense, ...prev]);
    setTitle("");
    setAmount("");
    setParticipants([]);
  };

  const handleRemove = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  return (
    <>
      <section className="card p-4 pb-5">
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          📒 新增支出
        </h2>

        {members.length === 0 ? (
          <p className="text-xs text-spriteText/60">
            還沒有成員唷，請先到「成員」頁面新增朋友再回來記錄支出 🌟
          </p>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-spriteText/70">支出名稱</label>
              <input
                className="w-full rounded-xl border border-spritePink/50 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-spritePink/80"
                placeholder="例如：晚餐、電影票、飲料"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-spriteText/70">金額</label>
              <input
                className="w-full rounded-xl border border-spriteMint/50 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-spriteMint/80"
                placeholder="例如：1200"
                value={amount}
                inputMode="decimal"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-spriteText/70">付款人</label>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayerId(m.id)}
                    className={`px-2.5 py-1.5 rounded-full text-xs flex items-center gap-1 shadow-sm ${
                      payerId === m.id
                        ? "bg-spriteLavender text-slate-700"
                        : "bg-white/80 text-spriteText/70"
                    }`}
                  >
                    <span className="text-base">{m.emoji}</span>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-spriteText/70">
                參與分帳的人
              </label>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m) => {
                  const active = participants.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleParticipant(m.id)}
                      className={`px-2.5 py-1.5 rounded-full text-xs flex items-center gap-1 shadow-sm ${
                        active
                          ? "bg-spriteMint text-slate-700"
                          : "bg-white/80 text-spriteText/70"
                      }`}
                    >
                      <span className="text-base">{m.emoji}</span>
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleAdd}
              className={`w-full rounded-xl py-2.5 text-sm font-semibold shadow-soft-card transition ${
                canSubmit
                  ? "bg-spritePink hover:bg-spritePink/90 text-slate-700"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              ➕ 新增這筆支出
            </button>
          </div>
        )}
      </section>

      <section className="card p-4 mb-24">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-spriteText/80">
            已記錄的支出
          </h3>
          <span className="pill">
            {expenses.length} 筆・總計 {total.toFixed(0)}
          </span>
        </div>
        {expenses.length === 0 ? (
          <p className="text-xs text-spriteText/60">
            目前還沒有任何支出，先新增幾筆吧 💸
          </p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {expenses.map((e) => {
              const payer = members.find((m) => m.id === e.payerId);
              const partMembers = members.filter((m) =>
                e.participantIds.includes(m.id)
              );
              return (
                <li
                  key={e.id}
                  className="rounded-2xl bg-gradient-to-r from-spritePink/40 via-spriteYellow/40 to-spriteMint/40 px-3.5 py-2.5 text-xs space-y-1.5 shadow-soft-card border border-white/70"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-spriteText">
                      {e.title}
                    </span>
                    <span className="text-spriteText/80">
                      ＄{e.amount.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-spriteText/70">
                      付款人：{payer ? `${payer.emoji} ${payer.name}` : "已刪除"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(e.id)}
                      className="text-[11px] text-red-400"
                    >
                      刪除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-spriteText/60">參與：</span>
                    {partMembers.map((m) => (
                      <MemberBadge key={m.id} member={m} size="sm" />
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <Link
        href="/result"
        className={`mt-3 block w-full rounded-xl py-2.5 text-xs text-center font-semibold shadow-soft-card transition ${
          expenses.length === 0
            ? "bg-slate-200 text-slate-400 pointer-events-none"
            : "bg-spriteLavender/90 text-slate-700 hover:bg-spriteLavender"
        }`}
      >
        查看結算結果 ✨
      </Link>

      <BottomNav />
    </>
  );
}
