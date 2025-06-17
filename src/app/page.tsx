'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { generateMockDeck } from '@/lib/utils/mock-deck-generator';

type Card = string;
type PlayerHand = {
  cards: Card[];
  score: number;
};

function getCardValue(card: Card, currentScore: number): number {
  const [, rank] = card.split('-');
  if (rank === 'King' || rank === 'Queen' || rank === 'Jack') {
    return 10;
  } else if (rank === 'Ace') {
    return currentScore + 11 <= 21 ? 11 : 1;
  } else {
    return parseInt(rank, 10);
  }
}

export default function Home() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [gameState, setGameState] = useState<'idle' | 'dealing' | 'finished'>('idle');
  const [hands, setHands] = useState<PlayerHand[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [commentary, setCommentary] = useState<string[]>([]);
  const [winner, setWinner] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>('');

  const startGame = () => {
    const newDeck = generateMockDeck([]);
    setDeck(newDeck);
    setHands(Array.from({ length: numPlayers }, () => ({ cards: [], score: 0 })));
    setCommentary([]);
    setWinner(null);
    setExplanation('');
    setGameState('dealing');
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (gameState !== 'dealing') return;

    const deal = async () => {
      let localHands = [...hands];
      let localDeck = [...deck];
      let localCommentary = [...commentary];
      let gameOver = false;
      let highScore = 0;

      while (!gameOver && localDeck.length > 0) {
        let cardsDealtThisRound = 0;

        for (let i = 0; i < numPlayers; i++) {
          if (localHands[i].score < 17) {
            if (localDeck.length === 0) break;
            const card = localDeck.shift()!;
            const newScore = localHands[i].score + getCardValue(card, localHands[i].score);
            localHands[i] = {
              ...localHands[i],
              cards: [...localHands[i].cards, card],
              score: newScore,
            };
            cardsDealtThisRound++;
            localCommentary.push(`Dealt ${card} to Player ${i + 1}. Score: ${newScore}`);

            if (newScore === 21) {
              localCommentary.push(`Player ${i + 1} has 21 and wins!`);
              setWinner(i + 1);
              setExplanation('Reached exactly 21');
              gameOver = true;
              break;
            } else if (newScore > 21) {
              localCommentary.push(`Player ${i + 1} busted with ${newScore}`);
            } else if (newScore <= 16) {
              localCommentary.push(`Player ${i + 1} has ${newScore} and must take another card.`);
            } else {
              localCommentary.push(`Player ${i + 1} has ${newScore} and stands.`);
            }

            highScore = Math.max(highScore, newScore <= 21 ? newScore : 0);

            await delay(1000); // Delay for visibility
            setHands([...localHands]);
            setCommentary([...localCommentary]);
          }
        }

        if (cardsDealtThisRound === 0) {
          gameOver = true;
        }
      }

      if (!gameOver) {
        // If deck exhausted or no more deals
        gameOver = true;
      }

      if (winner === null) {
        const eligibleHands = localHands
          .map((hand, index) => ({ index, score: hand.score <= 21 ? hand.score : 0 }))
          .filter(h => h.score === highScore);

        if (eligibleHands.length === 1) {
          const winIndex = eligibleHands[0].index;
          setWinner(winIndex + 1);
          setExplanation(`Highest score of ${highScore} without busting`);
          localCommentary.push(`Player ${winIndex + 1} wins with highest score ${highScore}`);
        } else {
          setWinner(null);
          setExplanation('Tie or all busted');
          localCommentary.push('No winner: tie or all busted');
        }
      }

      setHands(localHands);
      setDeck(localDeck);
      setCommentary(localCommentary);
      setGameState('finished');
    };

    deal();
  }, [gameState, numPlayers, hands, deck, commentary, winner]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Jack</h1>
      {gameState === 'idle' && (
        <>
          <label>
            Number of players:
            <select value={numPlayers} onChange={e => setNumPlayers(parseInt(e.target.value))}>
              {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button onClick={startGame}>Start Game</button>
        </>
      )}
      {gameState !== 'idle' && (
        <>
          <div>
            <h2>Players' Hands</h2>
            {hands.map((hand, index) => (
              <div key={index}>
                <strong>Player {index + 1}:</strong> Score: {hand.score}, Cards: {hand.cards.join(', ')}
              </div>
            ))}
          </div>
          <div>
            <h2>Commentary</h2>
            {commentary.map((msg, idx) => <p key={idx}>{msg}</p>)}
          </div>
          {gameState === 'finished' && (
            <>
              {winner ? (
                <h2>Winner: Player {winner} - {explanation}</h2>
              ) : (
                <h2>No winner - {explanation}</h2>
              )}
              <button onClick={() => setGameState('idle')}>Play Again</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
