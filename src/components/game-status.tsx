interface GameStatusProps {
  gameOver: boolean;
  currentPlayerIdx: number;
  getPlayerDisplayName: (playerId: number) => string;
  pushMessage?: string;
  commentary: string[];
}

export function GameStatus({
  gameOver,
  currentPlayerIdx,
  getPlayerDisplayName,
  pushMessage,
  commentary,
}: GameStatusProps) {
  return (
    <div className="space-y-6">
      {/* Game Status Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          🃏 Simple Jack
        </h1>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 inline-block">
          <div className="text-white text-xl font-semibold">
            {!gameOver && (
              <span className="flex items-center justify-center space-x-2">
                <span className="animate-pulse">🎯</span>
                <span>
                  Current player: {getPlayerDisplayName(currentPlayerIdx + 1)}
                </span>
              </span>
            )}
            {gameOver && (
              <span className="flex items-center justify-center space-x-2">
                <span>🎉</span>
                <span>Game Complete!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Push Message */}
      {gameOver && pushMessage && (
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-4 border-yellow-600 rounded-2xl p-6 shadow-2xl inline-block transform hover:scale-105 transition-transform">
            <div className="text-yellow-900 text-3xl font-bold mb-2 flex items-center justify-center space-x-2">
              <span>🤝</span>
              <span>PUSH</span>
            </div>
            <div className="text-yellow-800 text-lg font-semibold">
              {pushMessage.replace("Push - ", "")}
            </div>
          </div>
        </div>
      )}

      {/* Commentary */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-2xl border-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <span>📢</span>
            <span>Game Commentary</span>
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {commentary.length === 0 ? (
              <div className="text-gray-500 text-center py-4 italic">
                Game commentary will appear here...
              </div>
            ) : (
              commentary.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-gray-700 font-medium">{comment}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
