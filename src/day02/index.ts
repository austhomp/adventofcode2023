import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

interface Game {
  id: string;
  maxColors: CubeColors;
  runs: CubeColors[];
}

interface CubeColors {
  red: number;
  blue: number;
  green: number;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");
  const games = parseGames(data);
  const matches = games.filter(
    (game) =>
      game.maxColors.red <= 12 &&
      game.maxColors.blue <= 14 &&
      game.maxColors.green <= 13,
  );

  const answer = matches.reduce((sum, game) => (sum += Number(game.id)), 0);
  return answer.toString();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");
  const games = parseGames(data);
  const answer = games.reduce((sum, game) => {
    const maxColors = game.maxColors;
    const power: number = maxColors.red * maxColors.green * maxColors.blue;
    sum += power;
    return sum;
  }, 0);

  return answer.toString();
};

function parseGames(data: string[]): Game[] {
  const games: Game[] = [];
  data.forEach((line) => {
    const mainLineParts = line.split(":");
    const id = mainLineParts[0].split(" ")[1];
    const instances = mainLineParts[1].split(";");
    const game: Game = {
      id: id,
      runs: [],
      maxColors: { red: 0, blue: 0, green: 0 },
    };

    instances.forEach((exampleGame) => {
      const colorSections = exampleGame.trim().split(",");
      const colors: CubeColors = { red: 0, blue: 0, green: 0 };
      colorSections.forEach((colorPair) => {
        const colorPairParts = colorPair.trim().split(" ");
        const color = colorPairParts[1] as keyof CubeColors;
        colors[color] = Number(colorPairParts[0]);

        game.maxColors[color] = Math.max(game.maxColors[color], colors[color]);
      });

      game.runs.push(colors);
    });

    games.push(game);
  });
  return games;
}

run({
  part1: {
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: "8",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: "2286",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
