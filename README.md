# Simple Jack Simulated Card Game

`Simple Jack` is similar to blackjack.

In this game there are a minimum of 2 and a maximum of 6 players.

The deck of cards is going to be digital and consists of 52 unique cards.

There are 4 Suits of cards: Spades, Hearts, Clubs, Diamonds.

Each suit consists of the following:

1) 3 Face Cards: Jack, Queen, and King.
2) 1 Ace.
3) 9 Regular cards, which are numbered 2 through 10.

The value of each Face Card is 10.
The value of the Ace is either 1 or 11.
The values of the Regular cards are the same as their number.

Each card is represented by a string containing first the Suit followed by a dash ‘-‘ and the name or value of the card.

For example "Spades-King" would represent the King of Spades with a value of 10, "Hearts-9" would represent the 9 of Hearts with a value of 9, and "Diamonds-Ace" would represent the Ace of Diamonds with a value of either 1 or 11 (depending on the context of the hand).

The object of the game is to get the highest valued hand without exceeding 21.

Cards are dealt sequentially to each player one at a time.

As soon as a hand with a value of 21 is dealt, the player holding that hand is immediately declared the winner and the game ends.

This would occur if the player has any card valued at 10 and an Ace. For example if the player’s hand is ["Clubs-King", "Spades-Ace"] the total would be 21 with the Ace assigned the value of 11.

The value of the Ace is determined by the context of the hand the player holds and is evaluated  to give the player the best chance to win. For example, if the player has the hand `["Spades-10", "Hearts-Queen", "Hearts-Ace"]`, "Hearts-Ace" would be evaluated as 1, giving the player a winning hand of 21.

The first player dealt a hand of 21 is declared the winner, there is no further dealing, and the game is finished.

If there is no winner, an additional card is dealt using the following rules:

If the value of the player’s hand is 16 or less they must be dealt the next card in the deck.
If the value of the player’s hand is 17 or greater they must not be dealt another card.

If the value of a player’s hand exceeds 21 they are eliminated from the game.

Continue dealing cards until a player is dealt a winning hand of 21, all players are eliminated, or players can no longer draw cards.

If players can no longer draw cards, the player holding the highest hand which does not exceed 21 is the winner.

If the deck has been exhausted, the player holding the highest hand which does not exceed 21 is the winner.

If there is a tie in the value of the hands there is no winner.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Info

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
