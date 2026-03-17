export type MemberColor =
  | "spritePink"
  | "spriteMint"
  | "spriteYellow"
  | "spriteLavender"
  | "spriteSky";

export interface Member {
  id: string;
  name: string;
  emoji: string;
  color: MemberColor;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  payerId: string;
  participantIds: string[];
  createdAt: string;
}

export interface DiscountInfo {
  totalDiscount: number;
}

export interface PersonSummary {
  memberId: string;
  shouldPay: number;
  alreadyPaid: number;
  diff: number;
}

export interface Transfer {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}

export interface SplitResult {
  people: PersonSummary[];
  transfers: Transfer[];
}

export interface SplitState {
  members: Member[];
  expenses: Expense[];
  discount: DiscountInfo;
}

