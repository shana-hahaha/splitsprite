"use client";

import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@components/BottomNav";
import { Member, SplitResult, SplitState } from "@types/index";
import { loadState, saveState } from "@utils/storage";
import { calculateSplit } from "@utils/splitCalculator";
import { MemberBadge } from "@components/MemberBadge";

export default function ResultPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [result, setResult] = useState<SplitResult>({ people: [], transfers: [] });
  const [discount, setDiscount] = useState<string>("0");
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const state = loadState();
    if (state) {
      setMembers(state.members || []);
      setDiscount(String(state.discount?.totalDiscount ?? 0));
      const sum = (state.expenses || []).reduce((acc, e) => acc + e.amount, 0);
      setTotalExpense(sum);
      const r = calculateSplit(
        state.members || [],
        state.expenses || [],
        state.discount ?? { totalDiscount: 0 }
      );
      setResult(r);
    }
  }, []);

  const recompute = (discountValue: number, base?: SplitState) => {
    const state = base ?? loadState();
    if (!state) return;
    const newState: SplitState = {
      ...state,
      discount: { totalDiscount: discountValue }
    };
    saveState(newState);
    setTotalExpense(state.expenses.reduce((acc, e) => acc + e.amount, 0));
    const r = calculateSplit(newState.members, newState.expenses, newState.discount);
    setResult(r);
  };

  useEffect(() => {
    const raw = Number(discount);
    if (Number.isNaN(raw) || raw < 0) return;
    recompute(raw);
  }, [discount]);

  const summary = useMemo(() => {
    const payers = result.people.filter((p) => p.diff > 0);
    const debtors = result.people.filter((p) => p.diff < 0);
    return { payers, debtors };
  }, [result.people]);

  const getMember = (id: string) => members.find((m) => m.id === id);

  return (
    <>
      <section className="card p-4 pb-5">
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          ✨ 結算結果
        </h2>
        {members.length === 0 ? (
          <p className="text-xs text-spriteText/60">
            還沒有任何成員或支出，先到前兩個頁面建立資料唷 💕
          </p>
        ) : result.people.length === 0 ? (
          <p className="text-xs text-spriteText/60">
            目前沒有支出可以結算，請先新增支出再回來看看～
          </p>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="pill">總金額 ＄{totalExpense.toFixed(0)}</span>
              <span className="pill">
                折扣平均：每人 −
                {(
                  (Number(discount) || 0) /
                  (members.length || 1)
                ).toFixed(0)}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-spriteText/70">
                總折扣（例如：店家打折、折價券）
              </label>
              <input
                className="w-full rounded-xl border border-spriteLavender/60 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-spriteLavender/90"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                inputMode="decimal"
              />
            </div>
          </div>
        )}
      </section>

      {result.people.length > 0 && (
        <>
          <section className="card p-4 text-xs space-y-2">
            <h3 className="text-sm font-semibold text-spriteText/80 mb-1">
              每人應收
            </h3>
            <ul className="space-y-1.5 max-h-40 overflow-y-auto">
              {summary.payers.map((p) => {
                const m = getMember(p.memberId);
                if (!m) return null;
                return (
                  <li
                    key={p.memberId}
                    className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.emoji}</span>
                      <span className="text-sm font-medium">{m.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-500">
                      應收 ＄{p.diff.toFixed(0)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card p-4 text-xs space-y-2">
            <h3 className="text-sm font-semibold text-spriteText/80 mb-1">
              每人應付
            </h3>
            <ul className="space-y-1.5 max-h-40 overflow-y-auto">
              {summary.debtors.map((p) => {
                const m = getMember(p.memberId);
                if (!m) return null;
                return (
                  <li
                    key={p.memberId}
                    className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.emoji}</span>
                      <span className="text-sm font-medium">{m.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-rose-400">
                      應付 ＄{(-p.diff).toFixed(0)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card p-4 mb-16 text-xs space-y-2">
            <h3 className="text-sm font-semibold text-spriteText/80 mb-1 flex items-center gap-1">
              💌 最簡轉帳建議
            </h3>
            {result.transfers.length === 0 ? (
              <p className="text-xs text-spriteText/60">
                大家的金額已經打平，不需要再互相轉帳，太棒了！🎉
              </p>
            ) : (
              <ul className="space-y-1.5 max-h-52 overflow-y-auto">
                {result.transfers.map((t, idx) => {
                  const from = getMember(t.fromMemberId);
                  const to = getMember(t.toMemberId);
                  if (!from || !to) return null;
                  return (
                    <li
                      key={`${t.fromMemberId}-${t.toMemberId}-${idx}`}
                      className="flex items-center justify-between rounded-xl bg-slate-50/90 px-3 py-2"
                    >
                      <div className="flex items-center gap-1.5">
                        <MemberBadge member={from} size="sm" />
                        <span>➜</span>
                        <MemberBadge member={to} size="sm" />
                      </div>
                      <span className="text-xs font-semibold text-spriteText/80">
                        轉 ＄{t.amount.toFixed(0)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}

      <BottomNav />
    </>
  );
}
