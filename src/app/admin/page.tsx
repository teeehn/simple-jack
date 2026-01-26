"use client";

import { useState } from "react";
import { generateMockDeck } from "@/lib/utils/mock-deck-generator";
import { Card } from "@/shared/types";

export default function Admin() {
  const [generatedDeck, setGeneratedDeck] = useState<Card[] | null>(null);
  const [copied, setCopied] = useState(false);

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
      </div>
    </div>
  );
}
