import { simpleJack } from "./simple-jack";

type Card = string;

function createMockDeck(): Card[] {
    const deck: Card[] = ["Clubs", "Diamonds", "Hearts", "Spades"].map((suit) => {
        return (
            ["Ace", "King", "Queen", "Jack", 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .map((value) => `${suit}-${value}`)
        );
    }).flat();
    return deck;
}

describe("Simple Jack", () => {
    describe("Basic validations.", () => {
        test("Players must be a number 2 through 6", () => {
            const fullDeck: Card[] = createMockDeck();

            expect(() => simpleJack(fullDeck, 1)).toThrow();
            expect(() => simpleJack(fullDeck, 7)).toThrow();
            expect(() => simpleJack(fullDeck)).toThrow();
            expect(() => simpleJack(fullDeck, "2" as any)).toThrow();
            expect(() => simpleJack(fullDeck, 5)).not.toThrow();
        });
        test("Deck must be an array of length 52", () => {
            const fullDeck: Card[] = createMockDeck();

            expect(() => simpleJack([], 2)).toThrow();
            expect(() => simpleJack(["Spades-King"], 2)).toThrow();
            expect(() => simpleJack("Spades-King" as any, 2)).toThrow();
            expect(() => simpleJack(fullDeck, 3)).not.toThrow();
        });
        test("Deck must have 52 unique cards.", () => {
            expect(() => simpleJack(
                ['Spades-Jack', 'Spades-Jack', 'Spades-Ace', 'Clubs-Ace', 'Clubs-King', 'Clubs-Queen', 'Clubs-Jack', 'Clubs-2', 'Clubs-3', 'Clubs-4', 'Clubs-5', 'Clubs-6', 'Clubs-7', 'Clubs-8', 'Clubs-9', 'Clubs-10', 'Diamonds-Ace', 'Diamonds-King', 'Diamonds-Queen', 'Diamonds-Jack', 'Diamonds-2', 'Diamonds-3', 'Diamonds-4', 'Diamonds-5', 'Diamonds-6', 'Diamonds-7', 'Diamonds-8', 'Diamonds-9', 'Diamonds-10', 'Hearts-Ace', 'Hearts-King', 'Hearts-Queen', 'Hearts-Jack', 'Hearts-3', 'Hearts-4', 'Hearts-5', 'Hearts-6', 'Hearts-7', 'Hearts-8', 'Hearts-9', 'Hearts-10', 'Spades-King', 'Spades-Queen', 'Spades-2', 'Spades-3', 'Spades-4', 'Spades-5', 'Spades-6', 'Spades-7', 'Spades-8', 'Spades-9', 'Spades-10'],
                2
            )).toThrow();
        })
    });
    describe("Basic game play scenarios.", () => {
        test("2 players. Player 1 wins with 21 on two cards.", () => {
            const deck: Card[] = ['Spades-Jack', 'Hearts-2', 'Spades-Ace', 'Clubs-Ace', 'Clubs-King', 'Clubs-Queen', 'Clubs-Jack', 'Clubs-2', 'Clubs-3', 'Clubs-4', 'Clubs-5', 'Clubs-6', 'Clubs-7', 'Clubs-8', 'Clubs-9', 'Clubs-10', 'Diamonds-Ace', 'Diamonds-King', 'Diamonds-Queen', 'Diamonds-Jack', 'Diamonds-2', 'Diamonds-3', 'Diamonds-4', 'Diamonds-5', 'Diamonds-6', 'Diamonds-7', 'Diamonds-8', 'Diamonds-9', 'Diamonds-10', 'Hearts-Ace', 'Hearts-King', 'Hearts-Queen', 'Hearts-Jack', 'Hearts-3', 'Hearts-4', 'Hearts-5', 'Hearts-6', 'Hearts-7', 'Hearts-8', 'Hearts-9', 'Hearts-10', 'Spades-King', 'Spades-Queen', 'Spades-2', 'Spades-3', 'Spades-4', 'Spades-5', 'Spades-6', 'Spades-7', 'Spades-8', 'Spades-9', 'Spades-10'];

            expect(simpleJack(deck, 2))
                .toBe("Winner: 1, Hand: ['Spades-Jack', 'Spades-Ace'], Value: 21");
        });
        test("2 players. Player 1 busts. Player 2 wins with 17 (Can't hit).", () => {
            const deck: Card[] = ['Spades-Jack', 'Clubs-7', 'Spades-6', 'Diamonds-Jack', 'Hearts-10', 'Clubs-Ace', 'Clubs-King', 'Clubs-Queen', 'Clubs-Jack', 'Clubs-2', 'Clubs-3', 'Clubs-4', 'Clubs-5', 'Clubs-6', 'Clubs-8', 'Clubs-9', 'Clubs-10', 'Diamonds-Ace', 'Diamonds-King', 'Diamonds-Queen', 'Diamonds-2', 'Diamonds-3', 'Diamonds-4', 'Diamonds-5', 'Diamonds-6', 'Diamonds-7', 'Diamonds-8', 'Diamonds-9', 'Diamonds-10', 'Hearts-Ace', 'Hearts-King', 'Hearts-Queen', 'Hearts-Jack', 'Hearts-2', 'Hearts-3', 'Hearts-4', 'Hearts-5', 'Hearts-6', 'Hearts-7', 'Hearts-8', 'Hearts-9', 'Spades-Ace', 'Spades-King', 'Spades-Queen', 'Spades-2', 'Spades-3', 'Spades-4', 'Spades-5', 'Spades-7', 'Spades-8', 'Spades-9', 'Spades-10'];

            expect(simpleJack(deck, 2))
                .toBe("Winner: 2, Hand: ['Clubs-7', 'Diamonds-Jack'], Value: 17");
        });
        test("6 players. Winner is 2 with score of 20.", () => {
            const deck: Card[] = ['Clubs-Jack', 'Hearts-King', 'Clubs-7', 'Clubs-9', 'Clubs-6', 'Hearts-2', 'Diamonds-4', 'Spades-Jack', 'Clubs-10', 'Spades-9', 'Clubs-4', 'Diamonds-Jack', 'Diamonds-Queen', 'Hearts-7', 'Diamonds-10', 'Clubs-Ace', 'Clubs-King', 'Clubs-Queen', 'Clubs-2', 'Clubs-3', 'Clubs-5', 'Clubs-8', 'Diamonds-Ace', 'Diamonds-King', 'Diamonds-2', 'Diamonds-3', 'Diamonds-5', 'Diamonds-6', 'Diamonds-7', 'Diamonds-8', 'Diamonds-9', 'Hearts-Ace', 'Hearts-Queen', 'Hearts-Jack', 'Hearts-3', 'Hearts-4', 'Hearts-5', 'Hearts-6', 'Hearts-8', 'Hearts-9', 'Hearts-10', 'Spades-Ace', 'Spades-King', 'Spades-Queen', 'Spades-2', 'Spades-3', 'Spades-4', 'Spades-5', 'Spades-6', 'Spades-7', 'Spades-8', 'Spades-10'];

            expect(simpleJack(deck, 6))
                .toBe("Winner: 2, Hand: ['Hearts-King', 'Spades-Jack'], Value: 20");
        });

        test("6 players. Players 2 and 6 tie with scores of 20.", () => {
            const deck: Card[] = ['Clubs-Jack', 'Hearts-King', 'Clubs-7', 'Clubs-9', 'Clubs-6', 'Hearts-2', 'Diamonds-4', 'Spades-Jack', 'Clubs-10', 'Spades-9', 'Clubs-4', 'Diamonds-Jack', 'Diamonds-Queen', 'Hearts-7', 'Diamonds-8', 'Clubs-Ace', 'Clubs-King', 'Clubs-Queen', 'Clubs-2', 'Clubs-3', 'Clubs-5', 'Clubs-8', 'Diamonds-Ace', 'Diamonds-King', 'Diamonds-2', 'Diamonds-3', 'Diamonds-5', 'Diamonds-6', 'Diamonds-7', 'Diamonds-9', 'Diamonds-10', 'Hearts-Ace', 'Hearts-Queen', 'Hearts-Jack', 'Hearts-3', 'Hearts-4', 'Hearts-5', 'Hearts-6', 'Hearts-8', 'Hearts-9', 'Hearts-10', 'Spades-Ace', 'Spades-King', 'Spades-Queen', 'Spades-2', 'Spades-3', 'Spades-4', 'Spades-5', 'Spades-6', 'Spades-7', 'Spades-8', 'Spades-10'];

            expect(simpleJack(deck, 6))
                .toBe(null);
        });
    });

    describe("Edge cases and exceptions.", () => {
        test("Invalid card causes exception", () => {
            const deck: Card[] = [
                'Cubs-Jack', 'Hearts-King', 'Clubs-7', 'Clubs-9', 'Clubs-6', 'Hearts-2', 'Diamonds-4', 'Spades-Jack', 'Clubs-10', 'Spades-9', 'Clubs-4', 'Diamonds-Jack', 'Diamonds-Queen', 'Hearts-7', 'Diamonds-8'
            ].concat((new Array(52 - 15)).fill(" "));

            expect(() => simpleJack(deck, 6)).toThrow();
        });

        test("Duplicate card causes exception", () => {
            const deck: Card[] = [
                'Clubs-Jack', 'Hearts-King', 'Clubs-7', 'Clubs-9', 'Clubs-6', 'Hearts-2', 'Diamonds-4', 'Spades-Jack', 'Clubs-10', 'Spades-9', 'Clubs-Jack', 'Diamonds-Jack', 'Diamonds-Queen', 'Hearts-7', 'Diamonds-8'
            ].concat((new Array(52 - 15)).fill(" "));

            expect(() => simpleJack(deck, 6)).toThrow();
        });
        test("Multiple Aces in each hand to evaluate. Player 2 wins with 21.", () => {
            const deck: Card[] = ['Spades-Ace', 'Clubs-Ace', 'Hearts-Ace', 'Diamonds-Ace', 'Clubs-8', 'Hearts-4', 'Spades-5', 'Clubs-King', 'Clubs-Queen', 'Clubs-Jack', 'Clubs-2', 'Clubs-3', 'Clubs-4', 'Clubs-5', 'Clubs-6', 'Clubs-7', 'Clubs-9', 'Clubs-10', 'Diamonds-King', 'Diamonds-Queen', 'Diamonds-Jack', 'Diamonds-2', 'Diamonds-3', 'Diamonds-4', 'Diamonds-5', 'Diamonds-6', 'Diamonds-7', 'Diamonds-8', 'Diamonds-9', 'Diamonds-10', 'Hearts-King', 'Hearts-Queen', 'Hearts-Jack', 'Hearts-2', 'Hearts-3', 'Hearts-5', 'Hearts-6', 'Hearts-7', 'Hearts-8', 'Hearts-9', 'Hearts-10', 'Spades-King', 'Spades-Queen', 'Spades-Jack', 'Spades-2', 'Spades-3', 'Spades-4', 'Spades-6', 'Spades-7', 'Spades-8', 'Spades-9', 'Spades-10'];

            expect(simpleJack(deck, 2)).toBe(
                "Winner: 2, Hand: ['Clubs-Ace', 'Diamonds-Ace', 'Hearts-4', 'Spades-5'], Value: 21"
            );
        })
    });

    describe("Card dealing sequence tests", () => {
        test("Cards are dealt one at a time sequentially to players", () => {
            // Test with a valid deck to verify sequential dealing
            const fullDeck = createMockDeck();
            const deck: Card[] = [
                'Spades-2',    // Player 1, Round 1
                'Hearts-3',    // Player 2, Round 1
                'Clubs-4',     // Player 1, Round 2 (total: 2+4=6, needs more)
                'Diamonds-5',  // Player 2, Round 2 (total: 3+5=8, needs more)
                'Spades-6',    // Player 1, Round 3 (total: 6+6=12, needs more)
                'Hearts-7',    // Player 2, Round 3 (total: 8+7=15, needs more)
                'Clubs-8',     // Player 1, Round 4 (total: 12+8=20, stops)
                'Diamonds-9',  // Player 2, Round 4 (total: 15+9=24, busts)
                ...fullDeck.filter(card => !['Spades-2', 'Hearts-3', 'Clubs-4', 'Diamonds-5', 'Spades-6', 'Hearts-7', 'Clubs-8', 'Diamonds-9'].includes(card))
            ];

            const result = simpleJack(deck, 2);
            
            // Player 1 should win with 20 (Player 2 busts with 24)
            expect(result).toBe("Winner: 1, Hand: ['Spades-2', 'Clubs-4', 'Spades-6', 'Clubs-8'], Value: 20");
            
            // This test verifies that cards are dealt sequentially:
            // Round 1: Player 1 gets Spades-2, Player 2 gets Hearts-3
            // Round 2: Player 1 gets Clubs-4, Player 2 gets Diamonds-5
            // Round 3: Player 1 gets Spades-6, Player 2 gets Hearts-7
            // Round 4: Player 1 gets Clubs-8, Player 2 gets Diamonds-9
        });

        test("Cards are dealt sequentially in a valid game scenario", () => {
            // Test with a valid deck where we can track the dealing pattern
            const fullDeck = createMockDeck();
            const deck: Card[] = [
                // First round of dealing
                'Spades-2',    // Player 1's first card
                'Hearts-3',    // Player 2's first card
                'Clubs-4',     // Player 3's first card
                // Second round of dealing
                'Diamonds-5',  // Player 1's second card
                'Spades-6',    // Player 2's second card
                'Hearts-7',    // Player 3's second card
                // Third round of dealing
                'Clubs-8',     // Player 1's third card (total: 2+5+8=15, needs another)
                'Diamonds-9',  // Player 2's third card (total: 3+6+9=18, stops)
                'Spades-10',   // Player 3's third card (total: 4+7+10=21, wins!)
                // Remaining cards (fill to 52 total)
                ...fullDeck.filter(card => !['Spades-2', 'Hearts-3', 'Clubs-4', 'Diamonds-5', 'Spades-6', 'Hearts-7', 'Clubs-8', 'Diamonds-9', 'Spades-10'].includes(card))
            ];

            const result = simpleJack(deck, 3);
            
            // Player 3 should win with 21
            expect(result).toBe("Winner: 3, Hand: ['Clubs-4', 'Hearts-7', 'Spades-10'], Value: 21");
        });

        test("Verify dealing stops when player reaches 21", () => {
            const fullDeck = createMockDeck();
            const deck: Card[] = [
                'Spades-Jack',  // Player 1: 10
                'Hearts-5',     // Player 2: 5
                'Spades-Ace',   // Player 1: 10+11=21 (should win immediately)
                'Hearts-King',  // This shouldn't be dealt since Player 1 already won
                ...fullDeck.filter(card => !['Spades-Jack', 'Hearts-5', 'Spades-Ace', 'Hearts-King'].includes(card))
            ];

            const result = simpleJack(deck, 2);
            
            expect(result).toBe("Winner: 1, Hand: ['Spades-Jack', 'Spades-Ace'], Value: 21");
        });

        test("Verify dealing continues until all players reach 17 or bust", () => {
            const fullDeck = createMockDeck();
            const deck: Card[] = [
                // First round
                'Spades-2',     // Player 1: 2
                'Hearts-3',     // Player 2: 3
                // Second round  
                'Clubs-4',      // Player 1: 2+4=6
                'Diamonds-5',   // Player 2: 3+5=8
                // Third round
                'Spades-6',     // Player 1: 6+6=12
                'Hearts-7',     // Player 2: 8+7=15
                // Fourth round
                'Clubs-8',      // Player 1: 12+8=20 (stops)
                'Diamonds-9',   // Player 2: 15+9=24 (busts)
                ...fullDeck.filter(card => !['Spades-2', 'Hearts-3', 'Clubs-4', 'Diamonds-5', 'Spades-6', 'Hearts-7', 'Clubs-8', 'Diamonds-9'].includes(card))
            ];

            const result = simpleJack(deck, 2);
            
            expect(result).toBe("Winner: 1, Hand: ['Spades-2', 'Clubs-4', 'Spades-6', 'Clubs-8'], Value: 20");
        });

        test("Multiple players with different hand lengths", () => {
            const fullDeck = createMockDeck();
            const deck: Card[] = [
                // Round 1
                'Spades-10',    // Player 1: 10
                'Hearts-9',     // Player 2: 9  
                'Clubs-8',      // Player 3: 8
                // Round 2
                'Diamonds-7',   // Player 1: 10+7=17 (stops)
                'Spades-8',     // Player 2: 9+8=17 (stops)
                'Hearts-7',     // Player 3: 8+7=15
                // Round 3 (only Player 3 gets a card)
                'Clubs-6',      // Player 3: 15+6=21 (wins!)
                ...fullDeck.filter(card => !['Spades-10', 'Hearts-9', 'Clubs-8', 'Diamonds-7', 'Spades-8', 'Hearts-7', 'Clubs-6'].includes(card))
            ];

            const result = simpleJack(deck, 3);
            
            expect(result).toBe("Winner: 3, Hand: ['Clubs-8', 'Hearts-7', 'Clubs-6'], Value: 21");
        });
    });
});
