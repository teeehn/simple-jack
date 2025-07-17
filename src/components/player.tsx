import { IPlayerProps } from "@/shared/types";
import { Card, EmptyCardSlot } from "./card";

export function Player({
  hand,
  winner,
  isCurrentPlayer,
  isGameOver,
  displayName,
}: IPlayerProps & {
  isCurrentPlayer?: boolean;
  isGameOver?: boolean;
  displayName?: string;
}) {
  return (
    <div
      data-testid={`player-${hand.playerId}`}
      className={`relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 shadow-lg border-2 transition-all duration-300
       ${
         isCurrentPlayer && !isGameOver
           ? "ring-2 ring-yellow-400 ring-opacity-75 shadow-yellow-200"
           : "border-gray-200"
       } 
       ${hand.isEliminated ? "opacity-60 grayscale" : ""} 
       ${
         winner === hand.playerId
           ? "ring-2 ring-green-500 ring-opacity-75 shadow-green-200 bg-gradient-to-br from-green-50 to-green-100"
           : ""
       }`}
    >
      {/* Current player indicator */}
      {isCurrentPlayer && !isGameOver && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
          TURN
        </div>
      )}

      {/* Winner badge */}
      {winner === hand.playerId && (
        <div className="absolute -top-1 -left-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          WIN!
        </div>
      )}

      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {displayName || `Player ${hand.playerId}`}
          </h3>
          <div className="flex items-center space-x-2">
            <div
              className={`text-2xl font-bold ${
                hand.score > 21
                  ? "text-red-600"
                  : hand.score === 21
                  ? "text-green-600"
                  : "text-gray-800"
              }`}
            >
              {hand.score}
            </div>
            {hand.score === 21 && hand.cards.length === 2 && (
              <div className="bg-yellow-400 text-yellow-900 px-1 py-0.5 rounded text-xs font-bold">
                21!
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          {hand.isEliminated && (
            <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">
              BUST
            </div>
          )}
          {hand.hasStood && !hand.isEliminated && (
            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">
              STAND
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 justify-center">
        {hand.cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            className="transform hover:scale-105 transition-transform"
          />
        ))}
        {/* Show fewer empty slots to save space */}
        {hand.cards.length < 3 &&
          Array.from({
            length: Math.max(0, 3 - hand.cards.length),
          }).map((_, index) => (
            <EmptyCardSlot key={`empty-${index}`} className="opacity-30" />
          ))}
      </div>
    </div>
  );
}
