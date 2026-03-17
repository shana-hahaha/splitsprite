import { Member } from "@types/index";

const colorMap: Record<Member["color"], string> = {
  spritePink: "bg-spritePink/70",
  spriteMint: "bg-spriteMint/70",
  spriteYellow: "bg-spriteYellow/70",
  spriteLavender: "bg-spriteLavender/70",
  spriteSky: "bg-spriteSky/70"
};

interface MemberBadgeProps {
  member: Member;
  size?: "sm" | "md";
}

export function MemberBadge({ member, size = "md" }: MemberBadgeProps) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-spriteText shadow-sm";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={`${base} ${textSize} ${colorMap[member.color]}`}>
      <span className="text-base">{member.emoji}</span>
      <span>{member.name}</span>
    </span>
  );
}

