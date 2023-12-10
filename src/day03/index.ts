import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");
  const partsMap = new Map<string, Part>();
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const c = row[colIndex];
      if (!isNonNumericNonDot(c)) continue;
      const foundParts = findAdjacentParts(rowIndex, colIndex, data);
      foundParts.forEach((element) => {
        const key = `${element.partNumber}_${element.row}_${element.start}_${element.end}`;
        partsMap.set(key, element);
      });
    }
  }

  const sum = Array.from(partsMap.entries()).reduce((prev, entry) => {
    return prev + Number(entry[1].partNumber);
  }, 0);
  return sum.toString();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");
  const gearMap = new Map<string, Gear>();
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const c = row[colIndex];
      if (c !== "*") continue;
      const foundParts = findAdjacentParts(rowIndex, colIndex, data);
      const partsMap = new Map<string, Part>();
      foundParts.forEach((element) => {
        const key = `${element.partNumber}_${element.row}_${element.start}_${element.end}`;
        partsMap.set(key, element);
      });

      if (partsMap.size < 2) continue;

      const ratio = Array.from(partsMap.entries()).reduce((prev, entry) => {
        return prev * Number(entry[1].partNumber);
      }, 1);
      const gearKey = `${rowIndex}_${colIndex}`;
      const gear: Gear = { id: gearKey, parts: partsMap, ratio: ratio };
      gearMap.set(gearKey, gear);
    }
  }
  const sum = Array.from(gearMap.entries()).reduce((prev, entry) => {
    return prev + Number(entry[1].ratio);
  }, 0);
  return sum.toString();
};

interface Part {
  partNumber: string;
  row: number;
  start: number;
  end: number;
}

interface Gear {
  id: string; // x y coordinate
  parts: Map<string, Part>;
  ratio: number;
}

function isNonNumericNonDot(c: string) {
  return c != "." && !isNumber(c);
}

function isNumber(c: string) {
  return c >= "0" && c <= "9";
}

function findAdjacentParts(
  rowIndex: number,
  colIndex: number,
  data: String[],
): Part[] {
  const foundParts: Part[] = [];
  for (let r: number = rowIndex - 1; r <= rowIndex + 1; r++) {
    for (let c: number = colIndex - 1; c <= colIndex + 1; c++) {
      const character = data[r][c];
      if (!isNumber(character)) continue;
      const foundPart = findPartAt(r, c, data);
      if (foundPart) foundParts.push(foundPart);
    }
  }
  return foundParts;
}

function findPartAt(
  startRow: number,
  startCol: any,
  data: String[],
): Part | null {
  const searchRow = data[startRow];
  const startChar = searchRow[startCol];
  if (!isNumber(startChar)) return null;
  // expand left and right to find the whole part number string
  let leftIndex = startCol;
  let rightIndex = startCol;
  while (isNumber(searchRow[leftIndex - 1])) {
    leftIndex--;
  }
  while (isNumber(searchRow[rightIndex + 1])) {
    // console.log(`       searchRow[rightIndex+1]=${searchRow[rightIndex+1]}`);
    rightIndex++;
  }
  const fullPartNumber = searchRow.substring(leftIndex, rightIndex + 1);
  const part: Part = {
    partNumber: fullPartNumber,
    row: startRow,
    start: leftIndex,
    end: rightIndex,
  };
  return part;
}

run({
  part1: {
    tests: [
      {
        input: `
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..`,
        expected: "4361",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..`,
        expected: "467835",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
