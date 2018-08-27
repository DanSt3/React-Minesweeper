import React from 'react'; // eslint-disable-line no-unused-vars
import GameStateEnum from './GameStateEnum';
import CellData from './CellData';
import RandomList from '../utils/RandomList';

export const GameContext = React.createContext();

class GameData {
    constructor(rows, columns, mines, updateFunc) {
        this.gameState = GameStateEnum.NOT_STARTED;
        this.gridSize = {
            rows,
            columns,
        };
        this.mines = mines;
        this.minesMarked = 0;
        this.revealedRemaining = (rows * columns) - mines;

        this.createCells(rows, columns, mines);
        this.updateFunc = updateFunc;
    }

    getCell(rowIndex, columnIndex) {
        return this.cells[rowIndex][columnIndex];
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

    revealCell(row, column) {
        const cellData = this.getCell(row, column);
        // You can't reveal a cell that is currently marked
        if (!cellData.isMarked()) {
            console.log(`Cell (${row}, ${column}) revealed`); // eslint-disable-line no-console
            cellData.reveal();

            // If this cell has no mines around it, reveal all of its neighbors (this will be recursive!)
            if (cellData.getValue() === 0) {
                this.adjacentCellIterator(row, column,
                    (adjRow, adjColumn) => {
                        if (!this.getCell(adjRow, adjColumn).isRevealed()) {
                            this.revealCell(adjRow, adjColumn);
                        }
                    });
            }
            this.updateFunc(this);
        } else {
            console.log( // eslint-disable-line no-console
                `Cell (${row}, ${column}) is marked, can't be revealed`,
            );
        }
    }

    toggleMark(row, column) {
        // You can't mark a cell that has been revealed
        const cellData = this.getCell(row, column);
        if (!cellData.isRevealed()) {
            cellData.toggleMark();
            console.log( // eslint-disable-line no-console
                `Cell (${row}, ${column}) marked = ${cellData.isMarked()}`,
            );
            this.updateFunc(this);
        } else {
            console.log( // eslint-disable-line no-console
                `Cell (${row}, ${column}) is revealed, can't be marked`,
            );
        }
    }
}

export default GameData;
