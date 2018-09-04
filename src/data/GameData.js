import React from 'react'; // eslint-disable-line no-unused-vars
import GameStateEnum from './GameStateEnum';
import CellData from './CellData';
import RandomList from '../utils/RandomList';

export const GameContext = React.createContext();

const MINE_ANIMATION_INTERVAL = 200; // milliseconds
const OPEN_CELL_ANIMATION_INTERVAL = 100; // milliseconds

export default class GameData {
    constructor(rows, columns, mines, level, updateFunc) {
        this.gameState = GameStateEnum.NOT_STARTED;
        this.gameTimeCount = 0;
        this.gameTimer = null;
        this.animationTimer = null;

        this.gridSize = {
            rows,
            columns,
        };
        this.mines = mines;
        this.minesMarked = 0;
        this.revealedRemaining = (rows * columns) - mines;
        this.gameLevel = level;

        this.createCells(rows, columns, mines);
        this.updateFunc = updateFunc;
    }

    getCell(rowIndex, columnIndex) {
        return this.cells[rowIndex][columnIndex];
    }

    getMinesRemaining() {
        return (this.mines - this.minesMarked);
    }

    getGameTimeCount() {
        return this.gameTimeCount;
    }

    getGameLevel() {
        return this.gameLevel;
    }

    isAnimationInProgress() {
        return (this.animationTimer != null);
    }

    stopAnimation() {
        if (this.animationTimer != null) {
            window.clearInterval(this.animationTimer);
            this.animationTimer = null;
            this.updateGame();
        }
    }

    createCells(rows, columns, mines) {
        // Create the array of cells
        this.cells = Array(rows).fill().map(() => {
            const newRow = Array(columns).fill().map(() => {
                const newCell = new CellData();
                return newCell;
            });
            return newRow;
        });

        // Set the cells that will be mines
        const mineCells = RandomList(0, ((rows * columns) - 1), mines);
        mineCells.forEach((mineCellIndex) => {
            const rowIndex = Math.trunc(mineCellIndex / columns);
            const columnIndex = mineCellIndex % columns;
            this.cells[rowIndex][columnIndex].setMine(true);
        });

        // Fill in the values for the cells that aren't mines
        this.cells.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                cell.setValue(this.getCellValue(cell, rowIndex, columnIndex));
            });
        });
    }

    adjacentCellIterator(row, column, cellFunc) {
        let result = 0;
        const minRow = (row > 0) ? row - 1 : row;
        const maxRow = (row < this.gridSize.rows - 1) ? row + 1 : row;
        for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
            const minColumn = (column > 0) ? column - 1 : column;
            const maxColumn = (column < this.gridSize.columns - 1)
                ? column + 1 : column;
            for (let columnIndex = minColumn;
                columnIndex <= maxColumn;
                columnIndex++) {
                result += cellFunc(rowIndex, columnIndex);
            }
        }

        return result;
    }

    getCellValue(cell, row, column) {
        let count = 0;
        if (!cell.isMine()) {
            count = this.adjacentCellIterator(row, column,
                (adjRow, adjColumn) => (
                    this.cells[adjRow][adjColumn].isMine() ? 1 : 0));
        } else {
            // cell is a mine
            count = -1;
        }

        return count;
    }

    getGameState() {
        return this.gameState;
    }

    isGameOver() {
        return this.gameState === GameStateEnum.GAME_WON
            || this.gameState === GameStateEnum.GAME_LOST;
    }

    updateGame() {
        // If the game hasn't started, begin!
        if (this.gameState === GameStateEnum.NOT_STARTED) {
            this.gameState = GameStateEnum.IN_PROGRESS;
            this.startGameTimer();
        }

        // Tell the main app that the game data has changed
        this.updateFunc(this);
    }

    startNewGame(rows, columns, mines, level) {
        this.stopGameTimer();
        this.updateFunc(new GameData(rows, columns, mines, level,
            this.updateFunc));
    }

    startGameTimer() {
        this.gameTimeCount = 0; // (should already be 0, but just to be safe)
        this.gameTimer = window.setInterval(() => {
            this.gameTimeCount++;

            // Tell the main app that the data has changed
            this.updateFunc(this);
        }, 1000);
    }

    stopGameTimer() {
        if (this.gameTimer) {
            window.clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    gameWon() {
        this.gameState = GameStateEnum.GAME_WON;
        this.stopGameTimer();
        this.updateFunc(this);
    }

    gameLost() {
        this.gameState = GameStateEnum.GAME_LOST;
        this.stopGameTimer();
        this.revealRemainingMines();
    }

    revealRemainingMines() {
        // Display the remaining undiscovered mines
        const hiddenMines = this.findRemainingMines();
        const minesToReveal = hiddenMines.length;

        if (minesToReveal > 0) {
            // Using an incrementing index here instead of next() is because next() won't tell us we're
            // done until one call after the last item - that would mean one extra interval delay for us
            let mineIndex = 0;
            this.animationTimer = window.setInterval(() => {
                const cellData = hiddenMines[mineIndex++];
                cellData.reveal();
                this.updateFunc(this);

                if (mineIndex >= minesToReveal) {
                    this.stopAnimation();
                }
            }, MINE_ANIMATION_INTERVAL);
        }
    }

    findRemainingMines() {
        let hiddenMines = [];
        this.cells.forEach((row) => {
            hiddenMines = hiddenMines.concat(row.filter(cellData => (
                cellData.isMine() && !cellData.isRevealed()
            )));
        });
        return hiddenMines;
    }

    clickCell(row, column) {
        // if the game is over, animation is in progress, or this is cell marked or already revealed
        const cellData = this.getCell(row, column);
        if (this.isGameOver() || this.isAnimationInProgress()
            || cellData.isMarked() || cellData.isRevealed()) {
            return;
        }

        // If this is a mine - game over, man!
        if (cellData.isMine()) {
            this.gameLost();
            return;
        }

        // create a list of cells to reveal and add this cell to the list
        // We want to only add each cell only once, so we will use a the cellData's
        // "toBeRevealed" property
        const cellsToReveal = [{ row, column }];
        cellData.setToBeRevealed(true);

        // check if adjacent cells need to be revealed and add them to the list
        this.checkAdjacentCells(cellsToReveal, row, column);

        // there always be at least one cell to reveal, so don't wait to reveal it
        this.revealCell(cellsToReveal[0]);

        // if there are more cells to reveal, start animation timer
        const revealLength = cellsToReveal.length;
        if (revealLength > 1) {
            let revealIndex = 1;
            this.animationTimer = setInterval(() => {
                // on each animation tick, reveal a cell from the list
                this.revealCell(cellsToReveal[revealIndex++]);

                // if we're at the end of the list
                if (revealIndex >= revealLength) {
                    // end the animation cycle
                    this.stopAnimation();

                    // if there are no cells remaining to be revealed, you've won!
                    if (this.revealedRemaining === 0) {
                        this.gameWon();
                    }
                }
            }, OPEN_CELL_ANIMATION_INTERVAL);
        } else if (this.revealedRemaining === 0) {
            // only one cell to reveal and we've revealed it
            // if there are no cells remaining to be revealed, you've won!
            this.gameWon();
        }
    }

    checkAdjacentCells(cellsToReveal, row, column) {
        // if this cell has no mines around it
        const cellData = this.getCell(row, column);
        if (cellData.getValue() === 0) {
            // for each cell adjacent to this cell, reveal all of its neighbors
            this.adjacentCellIterator(row, column, (adjRow, adjColumn) => {
                const adjCellData = this.getCell(adjRow, adjColumn);
                if (!adjCellData.isRevealed()
                    && !adjCellData.isToBeRevealed()) {
                    // add that cell to the list to reveal
                    cellsToReveal.push({ row: adjRow, column: adjColumn });
                    adjCellData.setToBeRevealed(true);

                    // check if adjacent cells need to be revealed (this will be recursive!)
                    this.checkAdjacentCells(cellsToReveal, adjRow, adjColumn);
                }
            });
        }
    }

    revealCell({ row, column }) {
        const cellData = this.getCell(row, column);
        if (!cellData.isRevealed()) {
            cellData.reveal();
            this.revealedRemaining = this.revealedRemaining - 1;
            this.updateGame();
        }
    }

    toggleMark(row, column) {
        // If the game is over or we're in the middle of an animation, then we should do nothing
        if (this.isGameOver() || this.isAnimationInProgress()) {
            return;
        }

        // You can't mark a cell that has been revealed
        const cellData = this.getCell(row, column);
        if (!cellData.isRevealed()) {
            // Update the count of marked mines, based on the new marked state
            const newState = cellData.toggleMark();
            this.minesMarked = (newState) ? (this.minesMarked + 1)
                : (this.minesMarked - 1);

            this.updateGame();
        } else {
            console.log( // eslint-disable-line no-console
                `Cell (${row}, ${column}) is revealed, can't be marked`,
            );
        }
    }
}
