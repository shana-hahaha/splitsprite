import { DiscountInfo, Expense, Member, PersonSummary, SplitResult, Transfer } from "@types/index";

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateSplit(
  members: Member[],
  expenses: Expense[],
  discount: DiscountInfo
): SplitResult {
  if (!members.length || !expenses.length) {
    return { people: [], transfers: [] };
  }

  const memberMap = new Map(members.map((m) => [m.id, m]));
  const totals: Record<string, PersonSummary> = {};

  for (const member of members) {
    totals[member.id] = {
      memberId: member.id,
      shouldPay: 0,
      alreadyPaid: 0,
      diff: 0
    };
  }

  let totalAmount = 0;

  for (const expense of expenses) {
    const payer = memberMap.get(expense.payerId);
    if (!payer) continue;

    const validParticipants = expense.participantIds.filter((id) =>
      memberMap.has(id)
    );

    if (!validParticipants.length || expense.amount <= 0) continue;

    totalAmount += expense.amount;

    const share = expense.amount / validParticipants.length;

    for (const pid of validParticipants) {
      totals[pid].shouldPay += share;
    }

    totals[expense.payerId].alreadyPaid += expense.amount;
  }

  // 平均折扣
  let discountPerPerson = 0;
  if (discount.totalDiscount > 0 && members.length > 0) {
    discountPerPerson = discount.totalDiscount / members.length;
    for (const member of members) {
      totals[member.id].shouldPay = Math.max(
        0,
        totals[member.id].shouldPay - discountPerPerson
      );
    }
  }

  const people: PersonSummary[] = Object.values(totals).map((p) => {
    const shouldPay = roundToCents(p.shouldPay);
    const alreadyPaid = roundToCents(p.alreadyPaid);
    const diff = roundToCents(alreadyPaid - shouldPay);
    return { ...p, shouldPay, alreadyPaid, diff };
  });

  // diff > 0：多付（應收）; diff < 0：少付（應付）
  const creditors = [...people].filter((p) => p.diff > 0).sort((a, b) => b.diff - a.diff);
  const debtors = [...people].filter((p) => p.diff < 0).sort((a, b) => a.diff - b.diff);

  const transfers: Transfer[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = roundToCents(
      Math.min(creditor.diff, -debtor.diff)
    );

    if (amount > 0.01) {
      transfers.push({
        fromMemberId: debtor.memberId,
        toMemberId: creditor.memberId,
        amount
      });

      debtor.diff = roundToCents(debtor.diff + amount);
      creditor.diff = roundToCents(creditor.diff - amount);
    }

    if (Math.abs(debtor.diff) <= 0.01) i += 1;
    if (Math.abs(creditor.diff) <= 0.01) j += 1;
  }

  return { people, transfers };
}

