import { generateMockDeck } from './mock-deck-generator';

describe('generateMockDeck', () => {
    // Helper function to validate a complete deck
    const validateDeck = (deck) => {
        expect(deck).toHaveLength(52);
        expect(new Set(deck).size).toBe(52); // All cards unique

        // Check that all cards are valid format
        const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
        const ranks = ['Ace', 'King', 'Queen', 'Jack', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

        deck.forEach(card => {
            expect(typeof card).toBe('string');
            const [suit, rank] = card.split('-');
            expect(suits).toContain(suit);
            expect(ranks).toContain(rank);
        });
    };

    describe('Array input format', () => {
        test('should handle empty array', () => {
            const result = generateMockDeck([]);
            validateDeck(result);
            expect(result.length).toBe(52);
        });

        test('should handle single card array', () => {
            const testCase = ['Spades-Ace'];
            const result = generateMockDeck(testCase);
            validateDeck(result);
            expect(result[0]).toBe('Spades-Ace');
        });

        test('should handle multiple cards array', () => {
            const testCase = ['Spades-Ace', 'Hearts-8', 'Clubs-King'];
            const result = generateMockDeck(testCase);
            validateDeck(result);
            expect(result.slice(0, 3)).toEqual(testCase);
        });

        test('should handle array with all 52 cards', () => {
            const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
            const ranks = ['Ace', 'King', 'Queen', 'Jack', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            const fullDeck = suits.flatMap(suit =>
                ranks.map(rank => `${suit}-${rank}`)
            );

            const result = generateMockDeck(fullDeck);
            validateDeck(result);
            expect(result).toEqual(fullDeck);
        });

        test('should throw error for invalid card format', () => {
            expect(() => generateMockDeck(['Invalid-Card'])).toThrow('Invalid cards found: Invalid-Card');
            expect(() => generateMockDeck(['Spades'])).toThrow('Invalid cards found: Spades');
            expect(() => generateMockDeck(['Hearts-15'])).toThrow('Invalid cards found: Hearts-15');
        });

        test('should throw error for duplicate cards', () => {
            expect(() => generateMockDeck(['Spades-Ace', 'Spades-Ace'])).toThrow('Duplicate cards found in testCase');
        });

        test('should throw error for non-string cards', () => {
            expect(() => generateMockDeck([123])).toThrow('Invalid cards found: 123');
            expect(() => generateMockDeck([null])).toThrow('Invalid cards found: null');
        });
    });

    describe('Object input format (players)', () => {
        test('should handle single player with single card', () => {
            const testCase = { "1": ['Spades-Ace'] };
            const result = generateMockDeck(testCase);
            validateDeck(result);
            expect(result[0]).toBe('Spades-Ace');
        });

        test('should handle single player with multiple cards', () => {
            const testCase = { "1": ['Spades-Ace', 'Hearts-King', 'Clubs-Queen'] };
            const result = generateMockDeck(testCase);
            validateDeck(result);
            expect(result.slice(0, 3)).toEqual(['Spades-Ace', 'Hearts-King', 'Clubs-Queen']);
        });

        test('should handle multiple players with equal hands', () => {
            const testCase = {
                "1": ['Spades-Ace', 'Hearts-King'],
                "2": ['Clubs-Queen', 'Diamonds-Jack']
            };
            const result = generateMockDeck(testCase);
            validateDeck(result);
            // Cards should be dealt sequentially: player 1 first card, player 2 first card, player 1 second card, player 2 second card
            expect(result.slice(0, 4)).toEqual(['Spades-Ace', 'Clubs-Queen', 'Hearts-King', 'Diamonds-Jack']);
        });

        test('should handle multiple players with unequal hands', () => {
            const testCase = {
                "1": ['Spades-Ace', 'Hearts-King'],
                "2": ['Clubs-Queen', 'Diamonds-Jack', 'Hearts-10']
            };
            const result = generateMockDeck(testCase);
            validateDeck(result);
            // First round: Spades-Ace, Clubs-Queen
            // Second round: Hearts-King, Diamonds-Jack  
            // Third round: Hearts-10 (only player 2 has a third card)
            expect(result.slice(0, 5)).toEqual(['Spades-Ace', 'Clubs-Queen', 'Hearts-King', 'Diamonds-Jack', 'Hearts-10']);
        });

        test('should handle three players', () => {
            const testCase = {
                "1": ['Spades-Ace'],
                "2": ['Hearts-King'],
                "3": ['Clubs-Queen']
            };
            const result = generateMockDeck(testCase);
            validateDeck(result);
            expect(result.slice(0, 3)).toEqual(['Spades-Ace', 'Hearts-King', 'Clubs-Queen']);
        });

        test('should handle players with non-sequential IDs', () => {
            const testCase = {
                "3": ['Spades-Ace'],
                "1": ['Hearts-King'],
                "5": ['Clubs-Queen']
            };
            const result = generateMockDeck(testCase);
            validateDeck(result);
            // Should be sorted by player ID: 1, 3, 5
            expect(result.slice(0, 3)).toEqual(['Hearts-King', 'Spades-Ace', 'Clubs-Queen']);
        });

        test('should throw error for invalid player IDs', () => {
            expect(() => generateMockDeck({ "0": ['Spades-Ace'] })).toThrow('Player IDs must be between 1 and 6');
            expect(() => generateMockDeck({ "7": ['Spades-Ace'] })).toThrow('Player IDs must be between 1 and 6');
            expect(() => generateMockDeck({ "-1": ['Spades-Ace'] })).toThrow('Player IDs must be between 1 and 6');
        });

        test('should throw error for duplicate cards across players', () => {
            const testCase = {
                "1": ['Spades-Ace'],
                "2": ['Spades-Ace']
            };
            expect(() => generateMockDeck(testCase)).toThrow('Duplicate cards found in testCase');
        });

        test('should throw error for invalid cards in player hands', () => {
            const testCase = {
                "1": ['Invalid-Card']
            };
            expect(() => generateMockDeck(testCase)).toThrow('Invalid cards found: Invalid-Card');
        });

        test('should handle maximum 6 players', () => {
            const testCase = {
                "1": ['Spades-Ace'],
                "2": ['Hearts-King'],
                "3": ['Clubs-Queen'],
                "4": ['Diamonds-Jack'],
                "5": ['Spades-10'],
                "6": ['Hearts-9']
            };
            const result = generateMockDeck(testCase);
            validateDeck(result);
            expect(result.slice(0, 6)).toEqual(['Spades-Ace', 'Hearts-King', 'Clubs-Queen', 'Diamonds-Jack', 'Spades-10', 'Hearts-9']);
        });
    });

    describe('Input validation', () => {
        test('should throw error for null input', () => {
            expect(() => generateMockDeck(null)).toThrow('testCase must be an array or object');
        });

        test('should throw error for undefined input', () => {
            expect(() => generateMockDeck(undefined)).toThrow('testCase must be an array or object');
        });

        test('should throw error for string input', () => {
            expect(() => generateMockDeck('invalid')).toThrow('testCase must be an array or object');
        });

        test('should throw error for number input', () => {
            expect(() => generateMockDeck(123)).toThrow('testCase must be an array or object');
        });
    });

    describe('Deck completeness and randomness', () => {
        test('should always return exactly 52 cards', () => {
            const testCases = [
                [],
                ['Spades-Ace'],
                ['Spades-Ace', 'Hearts-King', 'Clubs-Queen'],
                { "1": ['Spades-Ace'] },
                { "1": ['Spades-Ace'], "2": ['Hearts-King'] }
            ];

            testCases.forEach(testCase => {
                const result = generateMockDeck(testCase);
                expect(result).toHaveLength(52);
            });
        });

        test('should contain all unique cards', () => {
            const testCases = [
                [],
                ['Spades-Ace', 'Hearts-King'],
                { "1": ['Spades-Ace'], "2": ['Hearts-King'] }
            ];

            testCases.forEach(testCase => {
                const result = generateMockDeck(testCase);
                const uniqueCards = new Set(result);
                expect(uniqueCards.size).toBe(52);
            });
        });

        test('should place test cards at the beginning in correct order', () => {
            const testCase = ['Spades-Ace', 'Hearts-King', 'Clubs-Queen'];
            const result = generateMockDeck(testCase);
            expect(result.slice(0, 3)).toEqual(testCase);
        });

        test('should randomize remaining cards', () => {
            const testCase = ['Spades-Ace'];
            const results = [];

            // Generate multiple decks and check that the remaining cards are different
            for (let i = 0; i < 5; i++) {
                const result = generateMockDeck(testCase);
                results.push(result.slice(1)); // Skip the first test card
            }

            // Check that not all remaining portions are identical (very unlikely if truly random)
            const allSame = results.every(deck =>
                JSON.stringify(deck) === JSON.stringify(results[0])
            );
            expect(allSame).toBe(false);
        });
    });

    describe('Edge cases', () => {
        test('should handle empty player hands', () => {
            const testCase = { "1": [] };
            const result = generateMockDeck(testCase);
            validateDeck(result);
        });

        test('should handle mixed empty and non-empty player hands', () => {
            const testCase = {
                "1": [],
                "2": ['Spades-Ace'],
                "3": []
            };
            const result = generateMockDeck(testCase);
            validateDeck(result);
            expect(result[0]).toBe('Spades-Ace');
        });
    });
});
