import { Card as CardType } from "@/shared/types";
import { getCardParts, getSuitColor, getSuitSymbol } from "@/lib/utils";

interface CardProps {
  card: CardType;
  className?: string;
}

export function Card({ card, className = "" }: CardProps) {
  const { value } = getCardParts(card);
  const suitSymbol = getSuitSymbol(card);
  const colorClass = getSuitColor(card);

  return (
    <div
      className={`relative w-16 h-24 bg-white rounded-lg border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 card-deal-animation ${className}`}
    >
      <div className="absolute inset-0 bg-white rounded-lg p-1">
        {/* Top left corner */}
        <div
          className={`absolute top-1 left-1 text-xs font-bold ${colorClass} leading-none`}
        >
          <div>{value}</div>
          <div className="text-sm">{suitSymbol}</div>
        </div>

        {/* Center symbol */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${colorClass}`}
        >
          <div className="text-2xl font-bold">{suitSymbol}</div>
        </div>

        {/* Bottom right corner (rotated) */}
        <div
          className={`absolute bottom-1 right-1 text-xs font-bold ${colorClass} leading-none transform rotate-180`}
        >
          <div>{value}</div>
          <div className="text-sm">{suitSymbol}</div>
        </div>
      </div>
    </div>
  );
}

interface EmptyCardSlotProps {
  className?: string;
}

export function EmptyCardSlot({ className = "" }: EmptyCardSlotProps) {
  return (
    <div
      className={`w-16 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400 text-xs">•</div>
      </div>
    </div>
  );
}
