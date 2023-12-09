import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");
  const answer = data.reduce((a, i) => {
    const newVal = extractPart1(i);
    const newTotal = a + Number(newVal);
    return newTotal;
  }, 0);
  return answer.toString();
};

function extractPart1(s: string): string {
  let left: string = "";
  let right: string = "";
  Array.from(s).map((c) => {
    if (c < "0" || c > "9") return;
    left = left != "" ? left : c;
    right = c;
  });

  return `${left}${right}`;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = input.replaceAll("\r", "").split("\n");
  const answer = data.reduce((runningTotal, line) => {
    return runningTotal + Number(extractPart2(line));
  }, 0);

  return answer.toString();
};

function extractPart2(input: string): string {
  // console.log(`Input "${input}"`)
  let left: string = "";
  let right: string = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    // console.log(`  i=${i} c="${c}"`);
    var potentialLetter: string = "";
    if (c >= "0" && c <= "9") {
      // console.log(`    "${c}" was a number`);
      potentialLetter = c;
    } else {
      const foundWord = Object.keys(numberNamesMapping).filter((word) => {
        // console.log(`      trying to match ${word} to ${input.substring(i)} `)
        return input.substring(i).startsWith(word);
      });
      // console.log(`foundWord: ${foundWord}`);

      if (foundWord.length > 0) {
        // console.log(`  Found word ${foundWord}`);
        potentialLetter =
          numberNamesMapping[foundWord[0] as keyof typeof numberNamesMapping];
        // improvement: increment i by the length of foundWord[0]
        // i += foundWord[0].length -1; // this affected the answer
      }
    }

    if (potentialLetter != "") {
      left = left != "" ? left : potentialLetter;
      right = potentialLetter;
    }
  }

  return `${left}${right}`;
}

const numberNamesMapping = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

run({
  part1: {
    tests: [
      {
        input: `
          1abc2
          pqr3stu8vwx
          a1b2c3d4e5f
          treb7uchet`,
        expected: "142",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          two1nine
          eightwothree
          abcone2threexyz
          xtwone3four
          4nineeightseven2
          zoneight234
          7pqrstsixteen`,
        expected: "281",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
