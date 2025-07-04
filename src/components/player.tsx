import { Card, IPlayerProps } from "@/shared/types";
import { getCardParts } from "@/lib/utils";

function getSuitSymbol(card: Card): string {
  const suit = getCardParts(card).suit;
  switch (suit) {
    case "Hearts":
      return "♥";
    case "Diamonds":
      return "♦";
    case "Clubs":
      return "♣";
    case "Spades":
      return "♠";
    default:
      return "";
  }
}

function getSuitColor(card: Card): string {
  const suit = getCardParts(card).suit;
  return suit === "Hearts" || suit === "Diamonds"
    ? "text-red-600"
    : "text-black";
}

export function Player({
  hand,
  winner,
  isCurrentPlayer,
  isGameOver,
}: IPlayerProps & {
  isCurrentPlayer?: boolean;
  isGameOver?: boolean;
}) {
  return (
    <div
      data-testid={`player-${hand.playerId}`}
      className={`bg-white rounded-lg p-6 shadow-lg
       ${isCurrentPlayer && !isGameOver ? "ring-4 ring-yellow-400" : ""} 
       ${hand.isEliminated ? "opacity-50" : ""} 
       ${winner === hand.playerId ? "ring-4 ring-green-500" : ""}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Player {hand.playerId}
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{hand.score}</div>
          {hand.isEliminated && (
            <div className="text-red-600 font-semibold">BUST</div>
          )}
          {winner === hand.playerId && (
            <div className="text-green-600 font-semibold">WINNER!</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {hand.cards.map((card, index) => (
          <div
            key={index}
            className={`bg-white border-2 border-gray-300 rounded-lg p-2 text-center shadow-sm ${getSuitColor(
              card
            )}`}
          >
            <div className="text-lg font-bold">{getCardParts(card).value}</div>
            <div className="text-xl">{getSuitSymbol(card)}</div>
          </div>
        ))}
        {/* Empty card slots */}
        {Array.from({
          length: Math.max(0, 6 - hand.cards.length),
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-2 h-16"
          />
        ))}
      </div>
    </div>
  );
}
