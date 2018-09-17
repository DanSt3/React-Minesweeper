// import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import GameData from './GameData';

import GameLevelEnum from './GameLevelEnum';
import GameStateEnum from './GameStateEnum';

describe('GameData', () => {
    before(() => {
        debugger; /* eslint-disable-line no-debugger */
        // go to 'chrome://inspect/#devices' to debug!
    });

    afterEach(() => {
        // clean up any sinon stuff
        global.sinon.restore();
    });

    // This test was created as a simple test to check our unit test framework
    it('should tell is the game over based on the game\'s state', () => {
        // we don't need to actually create the cells for this test
        sinon.stub(GameData.prototype, 'createCells');
        let gameData = new GameData(5, 5, 5, GameLevelEnum.CUSTOM, () => {});
        // starting game state is NOT_STARTED
        expect(gameData.getGameState()).to.equal(GameStateEnum.NOT_STARTED);
        expect(gameData.isGameOver()).to.equal(false);
        // updating the game moves state to IN_PROGRESS
        gameData.updateGame();
        expect(gameData.getGameState()).to.equal(GameStateEnum.IN_PROGRESS);
        expect(gameData.isGameOver()).to.equal(false);
        // calling gameWon() ends the game as GAME_WON
        gameData.gameWon();
        expect(gameData.getGameState()).to.equal(GameStateEnum.GAME_WON);
        expect(gameData.isGameOver()).to.equal(true);

        // start over with a new game
        gameData = new GameData(5, 5, 5, GameLevelEnum.CUSTOM, () => {});
        expect(gameData.getGameState()).to.equal(GameStateEnum.NOT_STARTED);
        expect(gameData.isGameOver()).to.equal(false);
        // calling gameLost() ends the game as GAME_LOST
        sinon.stub(gameData, 'revealRemainingMines');
        gameData.gameLost();
        expect(gameData.getGameState()).to.equal(GameStateEnum.GAME_LOST);
        expect(gameData.isGameOver()).to.equal(true);
    });

    describe('adjacentCellIterator', () => {
        let gameData;
        let cellsTested;

        function iteratorCountFunc(row, column) {
            cellsTested.push({ row, column });
        }

        function compareCellIndices(actual, expected) {
            return (actual.row === expected.row
                && actual.column === expected.column);
        }

        beforeEach(() => {
            // we don't need to actually create the cells for this test
            sinon.stub(GameData.prototype, 'createCells');
            gameData = new GameData(5, 5, 5, GameLevelEnum.CUSTOM, () => {});

            // create an empty array to log cells called by the iterator
            cellsTested = [];
        });

        it('should call the function for each cell',
            () => {
                const testCases = [
                    {
                        label: 'middle of game field',
                        startRow: 2,
                        startColumn: 2,
                        expectedCells: [
                            { row: 1, column: 1 },
                            { row: 1, column: 2 },
                            { row: 1, column: 3 },
                            { row: 2, column: 1 },
                            { row: 2, column: 2 },
                            { row: 2, column: 3 },
                            { row: 3, column: 1 },
                            { row: 3, column: 2 },
                            { row: 3, column: 3 },
                        ],
                    },
                    {
                        label: 'upper-left corner',
                        startRow: 0,
                        startColumn: 0,
                        expectedCells: [
                            { row: 0, column: 0 },
                            { row: 0, column: 1 },
                            { row: 1, column: 0 },
                            { row: 1, column: 1 },
                        ],
                    },
                    {
                        label: 'middle of top row',
                        startRow: 0,
                        startColumn: 1,
                        expectedCells: [
                            { row: 0, column: 0 },
                            { row: 0, column: 1 },
                            { row: 0, column: 2 },
                            { row: 1, column: 0 },
                            { row: 1, column: 1 },
                            { row: 1, column: 2 },
                        ],
                    },
                    {
                        label: 'upper-right corner',
                        startRow: 0,
                        startColumn: 4,
                        expectedCells: [
                            { row: 0, column: 3 },
                            { row: 0, column: 4 },
                            { row: 1, column: 3 },
                            { row: 1, column: 4 },
                        ],
                    },
                    {
                        label: 'left edge of a middle row',
                        startRow: 2,
                        startColumn: 0,
                        expectedCells: [
                            { row: 1, column: 0 },
                            { row: 1, column: 1 },
                            { row: 2, column: 0 },
                            { row: 2, column: 1 },
                            { row: 3, column: 0 },
                            { row: 3, column: 1 },
                        ],
                    },
                    {
                        label: 'right edge of a middle row',
                        startRow: 3,
                        startColumn: 4,
                        expectedCells: [
                            { row: 2, column: 3 },
                            { row: 2, column: 4 },
                            { row: 3, column: 3 },
                            { row: 3, column: 4 },
                            { row: 4, column: 3 },
                            { row: 4, column: 4 },
                        ],
                    },
                    {
                        label: 'lower-left corner',
                        startRow: 4,
                        startColumn: 0,
                        expectedCells: [
                            { row: 3, column: 0 },
                            { row: 3, column: 1 },
                            { row: 4, column: 0 },
                            { row: 4, column: 1 },
                        ],
                    },
                    {
                        label: 'middle of bottom row',
                        startRow: 4,
                        startColumn: 3,
                        expectedCells: [
                            { row: 3, column: 2 },
                            { row: 3, column: 3 },
                            { row: 3, column: 4 },
                            { row: 4, column: 2 },
                            { row: 4, column: 3 },
                            { row: 4, column: 4 },
                        ],
                    },
                    {
                        label: 'lower-rght corner',
                        startRow: 4,
                        startColumn: 4,
                        expectedCells: [
                            { row: 3, column: 3 },
                            { row: 3, column: 4 },
                            { row: 4, column: 3 },
                            { row: 4, column: 4 },
                        ],
                    },
                ];

                testCases.forEach(({
                    startRow,
                    startColumn,
                    expectedCells,
                }) => {
                    // reset list of iterated cells
                    cellsTested = [];

                    gameData.adjacentCellIterator(startRow, startColumn,
                        iteratorCountFunc);

                    expectedCells.forEach((expectedCell, index) => {
                        const actualCell = cellsTested[index];
                        expect(compareCellIndices(actualCell, expectedCell))
                            .to.equal(true);
                    });
                });
            });
    });

    // This is more of an integration test, as it calls several methods in this class
    // as well as the CellData object and RandomList function.  But creating the game
    // field is a critical piece and should be verified.
    it('should correctly create the game board', () => {
        const TEST_HEIGHT = 16;
        const TEST_WIDTH = 20;
        const TEST_MINES = 45;
        const TEST_LEVEL = GameLevelEnum.CUSTOM;
        const gameData = new GameData(TEST_HEIGHT,
            TEST_WIDTH, 
            TEST_MINES,
            TEST_LEVEL,
            () => {});

        // there should be the expected number of mines
        let mines = 0;
        gameData.cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.isMine()) {
                    mines += 1;
                }
            });
        });
        expect(mines).to.equal(TEST_MINES);

        // for each cell that isn't a mine, it's value should equal the number of mines adjacent to it
        // (intentionally using a different traversing algorithm than in the GameData class)
        gameData.cells.forEach((row, rowTarget) => {
            row.forEach((cell, columnTarget) => {
                if (!cell.isMine()) {
                    let adjacentMines = 0;
                    for (let rowIndex = rowTarget - 1; rowIndex <= rowTarget + 1;
                        rowIndex++) {
                        for (let columnIndex = columnTarget - 1;
                            columnIndex <= columnTarget + 1; columnIndex++) {
                            if (rowIndex >= 0 && rowIndex < TEST_HEIGHT
                                && columnIndex >= 0
                                && columnIndex < TEST_WIDTH) {
                                const indexCell = gameData.getCell(rowIndex,
                                    columnIndex);
                                if (indexCell.isMine()) {
                                    adjacentMines += 1;
                                }
                            }
                        }
                    }
                    expect(cell.getValue()).to.equal(adjacentMines);
                }
            });
        });
    });
});
