import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");

  const cards: Card[] = [];
  data.map((line) => {
    const card = parseCard(line);
    cards.push(card);
  });

  const total = cards.reduce((sum, card) => {
    return sum + card.points;
  }, 0);

  return total.toString();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");
  const cards: CardPartB[] = [];
  data.map((line) => {
    const card = parseCardPartB(line);
    cards.push(card);
  });

  const total = cards.sort().reduce((sum, card) => {
    return sum + calcCards(parseInt(card.number) - 1, cards);
  }, 0);

  return total.toString();
};

interface Card {
  number: number;
  potentialWinners: string[];
  ownedCards: string[];
  actualWinners: string[];
  points: number;
}

interface CardPartB {
  number: string;
  matchCount: number;
}

function parseCard(line: string): Card {
  const nameValues = line.split(":");
  const cardNumber: string = nameValues[0].split(" ")[1];
  const values = nameValues[1].split("|");
  const potentialWinners = values[0].split(" ").filter((n) => n != "");
  const ownedCards = values[1].split(" ").filter((n) => n != "");
  const actualWinners = potentialWinners.filter((n) => ownedCards.includes(n));
  const wins = actualWinners.length;
  const points =
    wins > 0 ? (wins > 1 ? Math.pow(2, actualWinners.length - 1) : 1) : 0;
  return {
    number: 0,
    potentialWinners: potentialWinners,
    ownedCards: ownedCards,
    actualWinners: actualWinners,
    points: points,
  };
}

function calcCards(index: number, data: CardPartB[]): number {
  const card = data[index];
  const subCards = [...Array(card.matchCount).keys()].reduce((sum, offset) => {
    return sum + calcCards(index + offset + 1, data);
  }, 0);

  return 1 + subCards;
}
function parseCardPartB(line: string): CardPartB {
  const nameValues = nonEmptySplit(line, ":");
  const cardNumber: string = nonEmptySplit(nameValues[0], " ")[1];
  const values = nonEmptySplit(nameValues[1], "|");
  const potentialWinners = nonEmptySplit(values[0], " ");
  const ownedCards = nonEmptySplit(values[1], " ");
  const actualWinners = potentialWinners.filter((n) => ownedCards.includes(n));
  const wins = actualWinners.length;
  return {
    number: cardNumber,
    matchCount: wins,
  };
}

function nonEmptySplit(line: string, splitter: string): string[] {
  return line.split(splitter).filter((n) => n != "");
}

run({
  part1: {
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: "13",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: "30",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
