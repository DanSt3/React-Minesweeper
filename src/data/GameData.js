import React from 'react'; // eslint-disable-line no-unused-vars
import GameStateEnum from './GameStateEnum';
import CellData from './CellData';
import RandomList from '../utils/RandomList';

export const GameContext = React.createContext();

export default class GameData {
    constructor(rows, columns, mines, level, updateFunc) {
        this.gameState = GameStateEnum.NOT_STARTED;
        this.gameTimeCount = 0;
        this.gameTimer = null;

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
            this.startTimer();
        }

        // Tell the main app that the game data has changed
        this.updateFunc(this);
    }

    startNewGame(rows, columns, mines, level) {
        this.stopTimer();
        this.updateFunc(new GameData(rows, columns, mines, level,
            this.updateFunc));
    }

    startTimer() {
        this.gameTimeCount = 0; // (should already be 0, but just to be safe)
        this.gameTimer = window.setInterval(() => {
            this.gameTimeCount++;

            // Tell the main app that the data has changed
            this.updateFunc(this);
        }, 1000);
    }

    stopTimer() {
        if (this.gameTimer) {
            window.clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    gameWon() {
        this.gameState = GameStateEnum.GAME_WON;
        this.stopTimer();
    }

    gameLost() {
        this.gameState = GameStateEnum.GAME_LOST;
        this.stopTimer();

        // Display the remaining undiscovered mines
        this.cells.forEach((row) => {
            const hiddenMinesInRow = row.filter(cellData => (
                cellData.isMine() && !cellData.isRevealed()
            ));
            hiddenMinesInRow.forEach((cellData) => {
                cellData.reveal();
                this.updateFunc(this);
            });
        });
    }

    revealCell(row, column) {
        // If the game is over, then this should do nothing
        if (this.isGameOver()) {
            return;
        }

        const cellData = this.getCell(row, column);
        // You can't reveal a cell that is currently marked or already revealed
        if (!cellData.isMarked() && !cellData.isRevealed()) {
            cellData.reveal();

            // If this is a mine - game over, man!
            if (cellData.isMine()) {
                this.gameLost();
            } else {
                // else we revealed an non-mine space
                // decrement the count of remaining unrevealed cells
                this.revealedRemaining = this.revealedRemaining - 1;

                // if there are no cells remaining to be revealed, you've won!
                if (this.revealedRemaining === 0) {
                    this.gameWon();
                } else if (cellData.getValue() === 0) {
                    // if this cell has no mines around it, reveal all of its neighbors (this will be recursive!)
                    this.adjacentCellIterator(row, column,
                        (adjRow, adjColumn) => {
                            if (!this.getCell(adjRow, adjColumn).isRevealed()) {
                                this.revealCell(adjRow, adjColumn);
                            }
                        });
                }
            }
            this.updateGame();
        }
        // else the cell is marked or revealed, so it can't be revealed
    }

    toggleMark(row, column) {
        // If the game is over, then this should do nothing
        if (this.isGameOver()) {
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
