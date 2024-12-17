let originalBoard = [];

window.onload = function () {
    generateSudoku();
};

// Generate a solvable Sudoku puzzle
function generateSudoku() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));

    fillBoard(board);
    removeNumbers(board, 40); // Remove 40 numbers to create a puzzle
    originalBoard = board.map(row => [...row]); // Save for reset
    displayBoard(board);
}

// Backtracking algorithm to fill the board
function fillBoard(board) {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                nums = shuffle(nums);
                for (let num of nums) {
                    if (isValid(board, r, c, num)) {
                        board[r][c] = num;
                        if (fillBoard(board)) return true;
                        board[r][c] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Shuffle an array
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Remove random numbers to create a puzzle
function removeNumbers(board, count) {
    while (count > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            count--;
        }
    }
}

// Display the Sudoku grid
function displayBoard(board) {
    const container = document.getElementById("sudoku-container");
    container.innerHTML = ""; // Clear previous board

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("input");
            cell.type = "text";
            cell.maxLength = 1;
            cell.classList.add("cell");
            cell.id = `cell-${r}-${c}`;

            if (board[r][c] !== 0) {
                cell.value = board[r][c];
                cell.readOnly = true;
                cell.classList.add("readonly");
            }

            cell.oninput = () => validateInput(cell);
            container.appendChild(cell);
        }
    }
}

// Validate input for single digits 1-9
function validateInput(cell) {
    const value = cell.value;
    if (!/^[1-9]$/.test(value)) {
        cell.value = "";
    }
}

// Solve the Sudoku board using backtracking
function solveSudoku() {
    let board = getBoard();
    if (solve(board)) {
        displayBoard(board);
        document.getElementById("message").innerText = "Solved successfully!";
    } else {
        document.getElementById("message").innerText = "No solution exists.";
    }
}

// Get board data from the grid
function getBoard() {
    let board = [];
    for (let r = 0; r < 9; r++) {
        let row = [];
        for (let c = 0; c < 9; c++) {
            const cellValue = document.getElementById(`cell-${r}-${c}`).value;
            row.push(cellValue === "" ? 0 : parseInt(cellValue));
        }
        board.push(row);
    }
    return board;
}

// Solve function using backtracking
function solve(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, r, c, num)) {
                        board[r][c] = num;
                        if (solve(board)) return true;
                        board[r][c] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Check if placing num in board[r][c] is valid
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;

        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (board[boxRow][boxCol] === num) return false;
    }
    return true;
}

// Reset board to original state
function resetBoard() {
    displayBoard(originalBoard);
    document.getElementById("message").innerText = "";
}
