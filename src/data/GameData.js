import React from 'react'; // eslint-disable-line no-unused-vars
import GameStateEnum from './GameStateEnum';
import CellData from './CellData';
import RandomList from '../utils/RandomList';

export const GameContext = React.createContext();

class GameData {
    constructor(rows, columns, mines) {
        this.gameState = GameStateEnum.NOT_STARTED;
        this.gridSize = {
            rows,
            columns,
        };
        this.mines = mines;
        this.minesMarked = 0;
        this.revealedRemaining = (rows * columns) - mines;

        this.createCells(rows, columns, mines);
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

    getCellValue(cell, row, column) {
        let count = 0;
        if (!cell.isMine()) {
            const minRow = (row > 0) ? row - 1 : row;
            const maxRow = (row < this.gridSize.rows - 1) ? row + 1 : row;
            for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
                const minColumn = (column > 0) ? column - 1 : column;
                const maxColumn = (column < this.gridSize.columns - 1)
                    ? column + 1 : column;
                for (let columnIndex = minColumn;
                    columnIndex <= maxColumn;
                    columnIndex++) {
                    if (this.cells[rowIndex][columnIndex].isMine()) {
                        count++;
                    }
                }
            }
        } else {
            // cell is a mine
            count = -1;
        }

        return count;
    }
}

export default GameData;
