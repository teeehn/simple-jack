interface GameControlsProps {
  canUserChoose: boolean;
  onHit: () => void;
  onStand: () => void;
  gameOver: boolean;
  onNewGame: () => void;
  onChangeSettings: () => void;
}

export function GameControls({
  canUserChoose,
  onHit,
  onStand,
  gameOver,
  onNewGame,
  onChangeSettings,
}: GameControlsProps) {
  if (gameOver) {
    return (
      <div className="flex space-x-3">
        <button
          onClick={onNewGame}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-sm transform hover:scale-105"
        >
          🎲 Play New Game
        </button>
        <button
          onClick={onChangeSettings}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-sm transform hover:scale-105"
        >
          ⚙️ Settings
        </button>
      </div>
    );
  }

  if (!canUserChoose) {
    return null;
  }

  return (
    <div className="flex space-x-3">
      <button
        onClick={onHit}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-sm transform hover:scale-105 active:scale-95"
      >
        🃏 Hit Me
      </button>
      <button
        onClick={onStand}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-sm transform hover:scale-105 active:scale-95"
      >
        ✋ Stand
      </button>
    </div>
  );
}
