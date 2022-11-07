/*----- constants -----*/
const player1Color = 'var(--player-1-color)';
const player2Color = 'var(--player-2-color)';
const player3Color = 'var(--player-3-color)';

const player1BoxColor = 'var(--player-1-box)';
const player2BoxColor = 'var(--player-2-box)';
const player3BoxColor = 'var(--player-3-box)';


const lines = [
    ['0'],
    [1],
    [2],
    [3],

    [1],
    [1, 2],
    [2, 3],
    [3],

    [1, 4],
    [2, 5],
    [3, 6],

    [4],
    [4, 5],
    [5, 6],
    [6],

    [4, 7],
    [5, 8],
    [6, 9],

    [7],
    [7, 8],
    [8, 9],
    [9],

    [7],
    [8],
    [9]

];
// Declare variables
let selectedLines;
let playerTurn;
let message;

const main = document.getElementById('main');
const lineEls = document.querySelectorAll('.line');
const boxesEls = document.querySelectorAll('.box');
const messageArea = document.querySelector('h2');


const clickFunction = (e) => {
    let line = e.target;
    let lineID = line.id.replace('line', '');

    if (line.id === 'line' + lineID) {
        if (selectedLines.includes(lineID)) {
            return;
        } else {
            gameFunction(lineID);
        }
    }
}

main.addEventListener('click', clickFunction);


const gameFunction = (lineID) => {
    const preBox = countBoxLine().filter(box => Math.abs(box) >= 4).length;

    console.log('pre', preBox)
    selectedLines.push(lineID);

    const newBox = countBoxLine().filter(box => Math.abs(box) >= 4).length;
    console.log('new', newBox)

    if (preBox < newBox) {
        playerTurn.push(playerTurn[playerTurn.length - 1]);
        message = `It is still player ${playerTurn[playerTurn.length - 1]}'s turn`

    } else {
        const turn = playerTurn[playerTurn.length - 1] % 3 === 0 ? 1 : (playerTurn[playerTurn.length - 1] % 3 === 1 ? 2 : 3);
        playerTurn.push(turn);

        lineEls.forEach(function (line) {
            line.classList.remove(`line-p${playerTurn[playerTurn.length - 2]}`);
            line.classList.add(`line-p${turn}`);
        });

        console.log('player turn', playerTurn)

        message = `Player ${turn}'s turn`;
    }

    // Check if there are any more lines to fill
    if (gameOver()) {
        // Win logic
        boxes = countBoxLine();

        if ((numberOfBoxes(boxes, 4) > numberOfBoxes(boxes, -4)) && (numberOfBoxes(boxes, 4) > numberOfBoxes(boxes, 8))) {
            message = `Player 1 wins with ${numberOfBoxes(boxes, 4)} boxes!`;
        } else if (numberOfBoxes(boxes, -4) > numberOfBoxes(boxes, 4) && (numberOfBoxes(boxes, -4) > numberOfBoxes(boxes, 8))) {
            message = `Player 2 wins with ${numberOfBoxes(boxes, -4)} boxes!`;
        } else if (numberOfBoxes(boxes, 8) > numberOfBoxes(boxes, 4) && (numberOfBoxes(boxes, 8) > numberOfBoxes(boxes, -4))) {
            message = `Player 3 wins with ${numberOfBoxes(boxes, 8)} boxes!`;
        } else if (numberOfBoxes(boxes, 4) === numberOfBoxes(boxes, 4) && (numberOfBoxes(boxes, 4) > numberOfBoxes(boxes, 8))) {
            message = `Player 1 and Player 2 win with ${numberOfBoxes(boxes, 4)} boxes!`;
        } else if (numberOfBoxes(boxes, 4) === numberOfBoxes(boxes, 8) && (numberOfBoxes(boxes, 4) > numberOfBoxes(boxes, -4))) {
            message = `Player 1 and Player 3 win with ${numberOfBoxes(boxes, 4)} boxes!`;
        } else if (numberOfBoxes(boxes, -4) === numberOfBoxes(boxes, 8) && (numberOfBoxes(boxes, -4) > numberOfBoxes(boxes, 4))) {
            message = `Player 2 and Player 3 win with ${numberOfBoxes(boxes, 4)} boxes!`;
        } else {
            message = `Player 1, Player 2, and Player 3 have the same scores with ${numberOfBoxes(boxes, 4)} boxes!`;
        }
        let score = {}
        score["Player 1"] = numberOfBoxes(boxes, 4)
        score["Player 2"] = numberOfBoxes(boxes, -4)
        score["Player 3"] = numberOfBoxes(boxes, 8)

        localStorage.setItem("score", JSON.stringify(score))
        localStorage.setItem("message", JSON.stringify(message))
        render();
        window.location.replace('./result.html');

    } else {
        render();
    }
}

const render = () => {
    selectedLines.forEach(function (line, i) {
        lineEls[line - 1].style.backgroundColor = eval(`player${playerTurn[i]}Color`);
    });

    boxes = countBoxLine();
    boxes.forEach(function (box, i) {
        if (Math.abs(box) >= 4) {
            if (box === 4) {
                boxesEls[i - 1].style.backgroundColor = player1BoxColor;
            } else if (box === -4) {
                boxesEls[i - 1].style.backgroundColor = player2BoxColor;
            } else if (box === 8) {
                boxesEls[i - 1].style.backgroundColor = player3BoxColor;
            }
        }
    });
    displayMess();
}

const playerLineBox = () => {
    const boxes = [[], [], [], [], [], [], [], [], [], []];

    selectedLines.forEach(function (line, i) {
        let boxesTouchingLine = lines[line];

        boxesTouchingLine.forEach(function (box, j) {
            boxes[box].push(playerTurn[i])
        });
    });
    return boxes;
}

const countBoxLine = () => {
    const boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    selectedLines.forEach(function (line, i) {
        let linesTouchBoxesArray = lines[line];
        linesTouchBoxesArray.forEach(function (boxThatsTouched, j) {
            boxes[boxThatsTouched]++;

            if (boxes[boxThatsTouched] === 4) {
                if (playerTurn[i] === 1) {
                    boxes[boxThatsTouched] = 4;
                } else if (playerTurn[i] === 2) {
                    boxes[boxThatsTouched] = -4;
                } else if (playerTurn[i] === 3) {
                    boxes[boxThatsTouched] = 8;
                }
            }

        });
    });
    return boxes;
}


const numberOfBoxes = (boxArr, boxInt) => {
    return boxArr.filter(x => x == boxInt).length;
}


const gameOver = () => {
    if (selectedLines.length < 24) {
        return false;
    } else {
        return true;
    }
}


const displayMess = () => {
    messageArea.textContent = message;
}


const start = () => {
    selectedLines = [];
    playerTurn = [1];

    message = 'Player 1 selects the first line';
    render();

}

start();
