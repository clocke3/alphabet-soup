// *** Functions *** //
function findY(line) {
  const firstLineSplit = line.split("x");
  return firstLineSplit[1];
};

function validPosition(crossword, x, y) {
    return x >= 0 && x < crossword.length && y >= 0 && y < crossword[0].length;
}

function findWordInDirection(crossword, word, startX, startY, dirX, dirY) {
    let currX = startX + dirX;
    let currY = startY + dirY;
    let endIndex = 1;

    // check remaining characters
    while (endIndex < word.length) {
        if (!validPosition(crossword, currX, currY) || 
            crossword[currX][currY] !== word[endIndex]) {
            return null;
        }
        
        currX += dirX;
        currY += dirY;
        endIndex++;
    }

    // return start and end points in suggested output
    const endX = currX - dirX;
    const endY = currY - dirY;
    return startX.toString() + ":" + startY.toString() + " " + endX.toString() + ":" + endY.toString();
}

function searchWord(crossword, word) {
    const directions = [
        [-1, -1], // upper left
        [-1, 0],  // left
        [-1, 1],  // lower left
        [0, -1],  // above        
        [0, 1],   // under
        [1, -1],  // upper right
        [1, 0],   // right
        [1, 1]    // lower right
    ];

    // check each character in crossword as possible starting point
    for (let i = 0; i < crossword.length; i++) {
        for (let j = 0; j < crossword[0].length; j++) {
            // bypass when current character doesn't match first letter
            if (crossword[i][j] !== word[0]) continue;

            // try all eight directions
            for (const [dirX, dirY] of directions) {
                const result = findWordInDirection(crossword, word, i, j, dirX, dirY);
                if (result) {
                    return result;
                }
            }
        }
    }

    return null;
}
// ***************** //

// *** Modules *** //
const fs = require('fs');
// ***************** //

// *** Main *** //

// set up variables
let lines = []; // lines in file
let parsedCrossword = [];  // representation of crossword
let originalWords = []  // words in crossword with no modification
let wordsToFind = []; // words in crossword modified
let result = [];     // values from search

// input from user
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// ask user for relative path
readline.question('Enter relative path: ', (filePath) => {
  try {
    // Read entire file and save line by line
    const content = fs.readFileSync(filePath, 'utf8');
    content.split(/\r?\n/).forEach(line =>  {
      lines.push(line);
    });

    // grab first line to determine array scope
    let firstLine = lines[0];
    let y = findY(firstLine);

    let yNum = Number(y);
    
    // grab lines from 1 to y and parse out crossword array
    for (let i = 1; i <= yNum; i++) {
      let letters = lines[i].split(" ");
      parsedCrossword.push(letters);
    }

    // grab lines after y to compile words
    // remove spaces from words that have spaces in them
    for (let i = yNum + 1; i < lines.length; i++) {
      let word = lines[i];
      originalWords.push(word);
      if (word.includes(" ")) {
        wordsToFind.push(word.split(" ").join(""));
      } else {
        wordsToFind.push(word);
      }
    }
    // return start and end points of nested array 
    // for each word in wordsToFind array
    for (const element of wordsToFind) {
      result.push(searchWord(parsedCrossword, element));
    }

    // log each item in result on new line
    for (let i = 0; i < originalWords.length; i++) {
      console.log(originalWords[i] + " " + result[i]);
    }

  } catch (error) {
    console.error('Error reading file:', error.message);
  }
  readline.close();
});
// ***************** //