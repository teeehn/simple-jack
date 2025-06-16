'use client';

import { simpleJack } from '../lib/simple-jack';
import { createMockDeck } from '../lib/utils/create-mock-deck';
import React from 'react';

export default function Home() {
  const [numPlayers, setNumPlayers] = React.useState(2);
  const [result, setResult] = React.useState<string | null>(null);
  const [deck, setDeck] = React.useState<string[] | null>(null);

  const startGame = () => {
    const newDeck = createMockDeck();
    setDeck(newDeck);
    const result = simpleJack(newDeck, numPlayers);
    setResult(result);
  };

  return (
    <div>
      <h1>Simple Jack</h1>
      <div>
        <label>Number of players: </label>
        <select value={numPlayers} onChange={(e) => setNumPlayers(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => i + 2).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <button onClick={startGame}>Start Game</button>
      {result && <div>{result}</div>}
      {result && <button onClick={() => setResult(null)}>Play Again</button>}
    </div>
  );
}
