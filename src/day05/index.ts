import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");
  const parsed = parseData(data);
  // console.log(JSON.stringify(parsed.seeds, undefined, " "));
  // console.log(JSON.stringify(parsed.seedsToSoil, undefined, " "));
  const answer = parsed.seeds.reduce((prevLow, seed) => {
    const soil = FindInMap(parsed.seedsToSoil, seed);
    const fertilizer = FindInMap(parsed.soilToFertilizer, soil);
    const water = FindInMap(parsed.fertilizerToWater, fertilizer);
    const light = FindInMap(parsed.waterToLight, water);
    const temperature = FindInMap(parsed.lightToTemperature, light);
    const humidity = FindInMap(parsed.temperatureToHumidity, temperature);
    const location = FindInMap(parsed.humidityToLocation, humidity);

    return Math.min(prevLow, location);
  }, Number.MAX_VALUE);

  return answer.toString();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

interface ItemMap {
  sourceRangeStart: number;
  destinationRangeStart: number;
  rangeLength: number;
}

interface ParsedData {
  seeds: number[];
  seedsToSoil: ItemMap[];
  soilToFertilizer: ItemMap[];
  fertilizerToWater: ItemMap[];
  waterToLight: ItemMap[];
  lightToTemperature: ItemMap[];
  temperatureToHumidity: ItemMap[];
  humidityToLocation: ItemMap[];
}

interface MapLookup {
  seedsToSoil: Map<Number, Number>;
  soilToFertilizer: ItemMap[];
  fertilizerToWater: ItemMap[];
  waterToLight: ItemMap[];
  lightToTemperature: ItemMap[];
  temperatureToHumidity: ItemMap[];
  humidityToLocation: ItemMap[];
}

function FindInMap(lookupMap: ItemMap[], sourceNumber: number): number {
  const matchingMap = lookupMap.filter(
    (itemMap) =>
      itemMap.sourceRangeStart <= sourceNumber &&
      sourceNumber <= itemMap.sourceRangeStart + itemMap.rangeLength,
  );
  if (matchingMap?.length <= 0) return sourceNumber;

  return (
    matchingMap[0].destinationRangeStart +
    (sourceNumber - matchingMap[0].sourceRangeStart)
  );
}

function parseData(lines: string[]): ParsedData {
  const seeds = nonEmptySplit(nonEmptySplit(lines[0], ":")[1], " ").map((s) =>
    Number(s),
  );
  const seedsToSoil = parseMaps(lines, "seed-to-soil");
  const soilToFertilizer = parseMaps(lines, "soil-to-fertilizer");
  const fertilizerToWater = parseMaps(lines, "fertilizer-to-water");
  const waterToLight = parseMaps(lines, "water-to-light");
  const lightToTemperature = parseMaps(lines, "light-to-temperature");
  const temperatureToHumidity = parseMaps(lines, "temperature-to-humidity");
  const humidityToLocation = parseMaps(lines, "humidity-to-location");

  const combinedMaps: ParsedData = {
    seeds: seeds,
    seedsToSoil: seedsToSoil,
    soilToFertilizer: soilToFertilizer,
    fertilizerToWater: fertilizerToWater,
    waterToLight: waterToLight,
    lightToTemperature: lightToTemperature,
    temperatureToHumidity: temperatureToHumidity,
    humidityToLocation: humidityToLocation,
  };

  return combinedMaps;
}

function parseMaps(lines: string[], startLabel: string): ItemMap[] {
  const startIndex = lines.findIndex((line) => line.startsWith(startLabel));
  let sliced = lines.slice(startIndex + 1);
  // console.log(`Using startIndex ${startIndex} first line is ${sliced[0]}`);
  let line = sliced[0];
  const maps: ItemMap[] = [];
  while (line?.trim()) {
    // console.log(`  ${startLabel}: ${line}`);
    const mapParts = nonEmptySplit(line, " ");
    const destinationRangeStart = Number(mapParts[0]);
    const sourceRangeStart = Number(mapParts[1]);
    const rangeLength = Number(mapParts[2]);
    maps.push({
      sourceRangeStart: sourceRangeStart,
      destinationRangeStart: destinationRangeStart,
      rangeLength: rangeLength,
    });
    sliced = sliced.slice(1);
    line = sliced[0];
  }

  return maps;
}

function nonEmptySplit(line: string, splitter: string): string[] {
  if (!line) return [];
  return line.split(splitter).filter((n) => n != "");
}

run({
  part1: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: "35",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
