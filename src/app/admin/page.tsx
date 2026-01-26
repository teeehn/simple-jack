"use client";

import { useState, useMemo } from "react";
import { generateMockDeck } from "@/lib/utils/mock-deck-generator";
import { Card, TestCase } from "@/shared/types";

const VALID_SUITS = ["Clubs", "Diamonds", "Hearts", "Spades"];
const VALID_VALUES = ["Ace", "King", "Queen", "Jack", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

const validateCard = (card: string): boolean => {
  const parts = card.split("-");
  if (parts.length !== 2) return false;
  const [suit, value] = parts;
  return VALID_SUITS.includes(suit) && VALID_VALUES.includes(value);
};

const parseCards = (input: string): string[] => {
  return input
    .split(",")
    .map((card) => card.trim())
    .filter((card) => card);
};

export default function Admin() {
  const [generatedDeck, setGeneratedDeck] = useState<Card[] | null>(null);
  const [copied, setCopied] = useState(false);

  // Test deck state
  const [playerInputs, setPlayerInputs] = useState<string[]>(["", ""]);
  const [touchedFields, setTouchedFields] = useState<Set<number>>(new Set());
  const [testDeck, setTestDeck] = useState<Card[] | null>(null);
  const [testDeckCopied, setTestDeckCopied] = useState(false);
  const [testDeckError, setTestDeckError] = useState<string | null>(null);

  // Validation (computed but only shown for touched fields)
  const validation = useMemo(() => {
    const errors: { [key: number]: string[] } = {};
    const allCards: string[] = [];
    const duplicates = new Set<string>();

    playerInputs.forEach((input, index) => {
      const cards = parseCards(input);
      const playerErrors: string[] = [];

      cards.forEach((card) => {
        if (!validateCard(card)) {
          playerErrors.push(`Invalid card: "${card}"`);
        } else {
          if (allCards.includes(card)) {
            duplicates.add(card);
          }
          allCards.push(card);
        }
      });

      if (playerErrors.length > 0) {
        errors[index] = playerErrors;
      }
    });

    // Add duplicate errors
    if (duplicates.size > 0) {
      playerInputs.forEach((input, index) => {
        const cards = parseCards(input);
        const dupeErrors = cards
          .filter((card) => duplicates.has(card))
          .map((card) => `Duplicate card: "${card}"`);
        if (dupeErrors.length > 0) {
          errors[index] = [...(errors[index] || []), ...dupeErrors];
        }
      });
    }

    return { errors, hasErrors: Object.keys(errors).length > 0 };
  }, [playerInputs]);

  const handleGenerateDeck = () => {
    const deck = generateMockDeck();
    setGeneratedDeck(deck);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (generatedDeck) {
      await navigator.clipboard.writeText(JSON.stringify(generatedDeck, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddPlayer = () => {
    if (playerInputs.length < MAX_PLAYERS) {
      setPlayerInputs([...playerInputs, ""]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerInputs.length > MIN_PLAYERS) {
      setPlayerInputs(playerInputs.filter((_, i) => i !== index));
    }
  };

  const handlePlayerInputChange = (index: number, value: string) => {
    const newInputs = [...playerInputs];
    newInputs[index] = value;
    setPlayerInputs(newInputs);
  };

  const handlePlayerInputBlur = (index: number) => {
    setTouchedFields((prev) => new Set(prev).add(index));
  };

  const handleGenerateTestDeck = () => {
    setTestDeckError(null);

    if (validation.hasErrors) {
      setTestDeckError("Please fix validation errors before generating.");
      return;
    }

    try {
      const testCase: TestCase = {};
      playerInputs.forEach((input, index) => {
        if (input.trim()) {
          const cards = parseCards(input) as Card[];
          testCase[(index + 1).toString()] = cards;
        }
      });

      if (Object.keys(testCase).length === 0) {
        setTestDeckError("Please enter at least one card for a player.");
        return;
      }

      const deck = generateMockDeck(testCase);
      setTestDeck(deck);
      setTestDeckCopied(false);
    } catch (error) {
      setTestDeckError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleCopyTestDeck = async () => {
    if (testDeck) {
      await navigator.clipboard.writeText(JSON.stringify(testDeck, null, 2));
      setTestDeckCopied(true);
      setTimeout(() => setTestDeckCopied(false), 2000);
    }
  };

  const handleClearTestDeck = () => {
    setTestDeck(null);
    setTestDeckError(null);
  };

  const handleResetTestDeck = () => {
    setPlayerInputs(["", ""]);
    setTouchedFields(new Set());
    setTestDeck(null);
    setTestDeckError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin - Mock Deck Generator</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Generate a full shuffled deck of 52 cards. Click the button below to create a new randomized deck.
          </p>

          <button
            onClick={handleGenerateDeck}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Generate Full Deck
          </button>

          {generatedDeck && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Generated Deck ({generatedDeck.length} cards)
                </h2>
                <button
                  onClick={handleCopy}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-4 rounded transition-colors text-sm"
                >
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                {JSON.stringify(generatedDeck, null, 2)}
              </pre>
              <button
                onClick={() => setGeneratedDeck(null)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Clear Result
              </button>
            </div>
          )}
        </div>

        {/* Test Deck Generator Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Test Deck Generator</h2>
          <p className="text-gray-600 mb-4">
            Generate a test deck with specific cards for each player. Enter comma-separated card values
            (e.g., <code className="bg-gray-100 px-1 rounded">Spades-Ace, Hearts-King, Clubs-10</code>).
          </p>

          <div className="space-y-3 mb-4">
            {playerInputs.map((input, index) => (
              <div key={index}>
                <div className="flex items-center gap-3">
                  <label className="w-20 text-gray-700 font-medium">
                    Player {index + 1}:
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => handlePlayerInputChange(index, e.target.value)}
                    onBlur={() => handlePlayerInputBlur(index)}
                    placeholder="Spades-Ace, Hearts-King, Clubs-10"
                    className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      touchedFields.has(index) && validation.errors[index]
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {playerInputs.length > MIN_PLAYERS && (
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className="text-red-500 hover:text-red-700 font-bold px-2"
                      title="Remove player"
                    >
                      X
                    </button>
                  )}
                </div>
                {touchedFields.has(index) && validation.errors[index] && (
                  <div className="ml-20 mt-1 pl-3">
                    {validation.errors[index].map((error, errIdx) => (
                      <p key={errIdx} className="text-red-600 text-sm">
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-4">
            {playerInputs.length < MAX_PLAYERS && (
              <button
                onClick={handleAddPlayer}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Add Player
              </button>
            )}
            <button
              onClick={handleGenerateTestDeck}
              disabled={validation.hasErrors}
              className={`font-semibold py-2 px-6 rounded-lg transition-colors ${
                validation.hasErrors
                  ? "bg-blue-300 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Generate Test Deck
            </button>
            <button
              onClick={handleResetTestDeck}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Reset
            </button>
          </div>

          {testDeckError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {testDeckError}
            </div>
          )}

          {testDeck && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  Generated Test Deck ({testDeck.length} cards)
                </h3>
                <button
                  onClick={handleCopyTestDeck}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-4 rounded transition-colors text-sm"
                >
                  {testDeckCopied ? "Copied!" : "Copy JSON"}
                </button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                {JSON.stringify(testDeck, null, 2)}
              </pre>
              <button
                onClick={handleClearTestDeck}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Clear Result
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
