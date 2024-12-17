let originalBoard; // Stores the solution for validation
let errorCount = 0; // Tracks the number of errors

// Function to generate a new Sudoku board
function generateSudoku() {
    errorCount = 0; // Reset errors
    document.getElementById("error-count").innerText = errorCount;

    let board = Array.from({ length: 9 }, () => Array(9).fill(0)); // Initialize empty board
    fillBoard(board);
    originalBoard = board.map(row => [...row]); // Save full solution
    removeNumbers(board, 40); // Remove 40 numbers to make it playable
    displayBoard(board);
}

// Fills the board using backtracking
function fillBoard(board) {
    function isSafe(row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num) return false;
        }
        let startRow = row - row % 3, startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    function solve() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isSafe(row, col, num)) {
                            board[row][col] = num;
                            if (solve()) return true;
                            board[row][col] = 0; // Backtrack
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solve();
}

function removeNumbers(board, count) {
    let removed = 0;
    while (removed < count) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removed++;
        }
    }
}

// Displays the board in the HTML grid
function displayBoard(board) {
    const container = document.getElementById("sudoku-container");
    container.innerHTML = ""; // Clear the board

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cell = document.createElement("input");
            cell.type = "text";
            cell.classList.add("cell");
            cell.id = `cell-${row}-${col}`;
            cell.maxLength = 1;

            if (board[row][col] !== 0) {
                cell.value = board[row][col];
                cell.classList.add("readonly"); // Fixed cells
            }

            // Add input validation
            cell.addEventListener("input", function () {
                validateInput(row, col, cell);
            });

            container.appendChild(cell);
        }
    }
}

// Validates user input
function validateInput(row, col, cell) {
    const userValue = cell.value;
    const correctValue = originalBoard[row][col]; // Correct solution

    // Reset classes
    cell.classList.remove("correct", "wrong");

    if (!userValue || isNaN(userValue) || userValue < 1 || userValue > 9) {
        cell.value = ""; // Clear invalid input
        return;
    }

    if (parseInt(userValue) === correctValue) {
        cell.classList.add("correct"); // Highlight correct input
    } else {
        cell.classList.add("wrong"); // Highlight incorrect input
        errorCount++;
        document.getElementById("error-count").innerText = errorCount;
    }
}

// Show the full solution when the "Show Solution" button is clicked
function showSolution() {
    const container = document.getElementById("sudoku-container");

    // Reveal the solution in the cells
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (!cell.classList.contains("readonly")) {
                cell.value = originalBoard[row][col]; // Set the correct value
                cell.classList.add("readonly"); // Lock the cell
            }
        }
    }
}
