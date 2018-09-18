// import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import GameData, {
    MINE_ANIMATION_INTERVAL,
    OPEN_CELL_ANIMATION_INTERVAL,
} from './GameData';

import GameLevelEnum from './GameLevelEnum';
import GameStateEnum from './GameStateEnum';

describe('GameData', () => {
    let gameData;
    let createCellsStub;
    let updateFuncStub;

    before(() => {
        debugger; /* eslint-disable-line no-debugger */
        // go to 'chrome://inspect/#devices' to debug!
    });

    beforeEach(() => {
        // we don't need to actually create the cells for this test
        createCellsStub = sinon.stub(GameData.prototype, 'createCells');
        // in case we want to verify that update was called
        updateFuncStub = sinon.stub();
        gameData = new GameData(5, 5, 5, GameLevelEnum.CUSTOM, updateFuncStub);
    });

    afterEach(() => {
        // clean up any sinon stuff
        global.sinon.restore();
    });

    // This test was created as a simple test to check our unit test framework
    it('should tell is the game over based on the game\'s state', () => {
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
        gameData = new GameData(5, 5, 5, GameLevelEnum.CUSTOM, updateFuncStub);
        expect(gameData.getGameState()).to.equal(GameStateEnum.NOT_STARTED);
        expect(gameData.isGameOver()).to.equal(false);
        // calling gameLost() ends the game as GAME_LOST
        sinon.stub(gameData, 'revealRemainingMines');
        gameData.gameLost();
        expect(gameData.getGameState()).to.equal(GameStateEnum.GAME_LOST);
        expect(gameData.isGameOver()).to.equal(true);
    });

    describe('adjacentCellIterator', () => {
        let cellsTested = [];

        function iteratorCountFunc(row, column) {
            cellsTested.push({ row, column });
        }

        function compareCellIndices(actual, expected) {
            return (actual.row === expected.row
                && actual.column === expected.column);
        }

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
        // remove stub so the constructor will create real cells
        createCellsStub.restore();

        const TEST_HEIGHT = 16;
        const TEST_WIDTH = 20;
        const TEST_MINES = 45;
        const TEST_LEVEL = GameLevelEnum.CUSTOM;
        gameData = new GameData(TEST_HEIGHT,
            TEST_WIDTH,
            TEST_MINES,
            TEST_LEVEL,
            updateFuncStub);

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
                    for (let rowIndex = rowTarget - 1;
                        rowIndex <= rowTarget + 1;
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

    it('should reveal remaining mines one per interval until done', () => {
        const REMAINING_MINES = 10;
        const fakeCellData = { reveal: sinon.stub() };
        const fakeRemainingMines = [];
        for (let index = 0; index < REMAINING_MINES; index++) {
            fakeRemainingMines.push(fakeCellData);
        }
        sinon.stub(gameData, 'findRemainingMines').returns(fakeRemainingMines);
        const stopAnimationSpy = sinon.spy(gameData, 'stopAnimation');
        updateFuncStub.resetHistory(); // reset call count
        const clock = sinon.useFakeTimers();

        // wait for one animation interval, and make sure reveal() and
        // updateFunc() have been called once, and stopAnimation() not called
        gameData.revealRemainingMines();
        clock.tick(MINE_ANIMATION_INTERVAL);
        expect(fakeCellData.reveal.calledOnce).to.equal(true);
        expect(updateFuncStub.calledOnce).to.equal(true);
        expect(stopAnimationSpy.callCount).to.equal(0);

        // wait for one interval from end of remaining mines, and make sure
        // reveal() and updateFunc() have been called the correct number of
        // times and stopAnimation() has still not been called
        clock.tick((MINE_ANIMATION_INTERVAL * (REMAINING_MINES - 2)));
        expect(fakeCellData.reveal.callCount).to.equal(REMAINING_MINES - 1);
        expect(updateFuncStub.callCount).to.equal(REMAINING_MINES - 1);
        expect(stopAnimationSpy.callCount).to.equal(0);

        // wait for last interval, and make sure reveal() and updateFunc()
        // have been called the correct number of/ times and stopAnimation()
        // has now been called
        clock.tick(MINE_ANIMATION_INTERVAL);
        expect(fakeCellData.reveal.callCount).to.equal(REMAINING_MINES);
        // (updateFunc() is called one extra time by stopAnimation())
        expect(updateFuncStub.callCount).to.equal(REMAINING_MINES + 1);
        expect(stopAnimationSpy.callCount).to.equal(1);
    });

    describe('clickCell', () => {
        let isGameOverStub;
        let isAnimationInProgressStub;
        let checkAdjacentCellsStub;
        let revealCellStub;
        let stopAnimationSpy;
        let fakeCellData;

        // Use a separate function to initialize the stubs on the GameData object
        // because if we redefine the GameData object with a new object then all
        // stubs are lost.  We can then call this function using the new objects
        // to set the mocks up again.
        function createStubs(gameDataObj) {
            isGameOverStub = sinon.stub(gameDataObj, 'isGameOver')
                .returns(false);
            isAnimationInProgressStub = sinon.stub(gameDataObj,
                'isAnimationInProgress').returns(false);
            checkAdjacentCellsStub = sinon.stub(gameDataObj,
                'checkAdjacentCells');
            revealCellStub = sinon.stub(gameDataObj, 'revealCell')
            stopAnimationSpy = sinon.spy(gameData, 'stopAnimation');;
            fakeCellData = {
                isMarked: sinon.stub().returns(false),
                isMine: sinon.stub().returns(false),
                isRevealed: sinon.stub().returns(false),
                reveal: sinon.stub(),
                setToBeRevealed: sinon.stub(),
            };
            sinon.stub(gameDataObj, 'getCell').returns(fakeCellData);
        }

        beforeEach(() => {
            createStubs(gameData);
        });

        it('should ignore the click if the game is over', () => {
            isGameOverStub.returns(true);
            gameData.clickCell(0, 0);
            expect(fakeCellData.setToBeRevealed.callCount).to.equal(0);
        });

        it('should ignore the click if animation is in progress', () => {
            isAnimationInProgressStub.returns(true);
            gameData.clickCell(0, 0);
            expect(fakeCellData.setToBeRevealed.callCount).to.equal(0);
        });

        it('should ignore the click if cell is marked', () => {
            fakeCellData.isMarked.returns(true);
            gameData.clickCell(0, 0);
            expect(fakeCellData.setToBeRevealed.callCount).to.equal(0);
        });

        it('should ignore the click if cell is already', () => {
            fakeCellData.isRevealed.returns(true);
            gameData.clickCell(0, 0);
            expect(fakeCellData.setToBeRevealed.callCount).to.equal(0);
        });

        it('should end the game if a mine is clicked on', () => {
            const gameLostStub = sinon.stub(gameData, 'gameLost');
            fakeCellData.isMine.returns(true);
            gameData.clickCell(0, 0);
            expect(fakeCellData.reveal.callCount).to.equal(1);
            expect(gameLostStub.calledOnce).to.equal(true);
            expect(updateFuncStub.calledOnce).to.equal(true);
        });

        it('should reveal the specified cell and check adjacent cells', () => {
            const CELL_ROW = 5;
            const CELL_COLUMN = 17;
            gameData.clickCell(CELL_ROW, CELL_COLUMN);
            expect(fakeCellData.setToBeRevealed.calledOnce).to.equal(true);
            expect(checkAdjacentCellsStub.calledOnce).to.equal(true);
            const expectedCell = { row: CELL_ROW, column: CELL_COLUMN };
            expect(revealCellStub.calledOnce).to.equal(true);
            expect(revealCellStub.calledWith(expectedCell)).to.equal(true);
        });

        it('should end game if there are no remaining non-mine cells', () => {
            // set the number mines so that this only one non-mine cell remaining
            const ROWS = 5;
            const COLUMNS = 5;
            const MINES = (ROWS * COLUMNS) - 1;
            gameData = new GameData(ROWS, COLUMNS, MINES, GameLevelEnum.CUSTOM,
                updateFuncStub);
            createStubs(gameData);
            revealCellStub.callsFake(() => {
                gameData.revealedRemaining -= 1;
            });
            const gameWonStub = sinon.stub(gameData, 'gameWon');

            gameData.clickCell(0, 0);
            expect(revealCellStub.calledOnce).to.equal(true);
            expect(gameWonStub.calledOnce).to.equal(true);
        });

        it('should reveal adjacent cells one per interval until done', () => {
            const START_CELL_ROW = 5;
            const START_CELL_COLUMN = 17;
            const ADDITIONAL_CELLS = 5;
            checkAdjacentCellsStub.callsFake((cellsToReveal) => {
                for (let index = 1; index <= ADDITIONAL_CELLS; index++) {
                    cellsToReveal.push({
                        row: START_CELL_ROW + index,
                        column: START_CELL_COLUMN + index,
                    });
                }
            });
            const clock = sinon.useFakeTimers();

            // first make sure the expected calls happen for the target cell
            gameData.clickCell(START_CELL_ROW, START_CELL_COLUMN);
            expect(fakeCellData.setToBeRevealed.calledOnce).to.equal(true);
            expect(checkAdjacentCellsStub.calledOnce).to.equal(true);
            const expectedCell = {
                row: START_CELL_ROW,
                column: START_CELL_COLUMN,
            };
            expect(revealCellStub.calledOnce).to.equal(true);
            expect(revealCellStub.calledWith(expectedCell)).to.equal(true);

            // wait for one animation interval, and make sure revealCell() has
            // been called twice and with the right cell, and that
            // stopAnimation() has not been called
            clock.tick(OPEN_CELL_ANIMATION_INTERVAL);
            expect(revealCellStub.callCount).to.equal(2);
            expectedCell.row++;
            expectedCell.column++;
            expect(revealCellStub.calledWith(expectedCell)).to.equal(true);
            expect(stopAnimationSpy.callCount).to.equal(0);

            // wait for one interval from end of list of cells to reveal, and
            // make sure revealCell() has been called the correct number of
            // times and with the correct cells, and that stopAnimation()
            // has still not been called
            clock.tick((OPEN_CELL_ANIMATION_INTERVAL * (ADDITIONAL_CELLS - 2)));
            // (remember, revealCell() was called once for the target cell)
            expect(revealCellStub.callCount).to.equal(ADDITIONAL_CELLS);
            for (let index = 0; index < (ADDITIONAL_CELLS - 2); index++) {
                expectedCell.row++;
                expectedCell.column++;
                expect(revealCellStub.calledWith(expectedCell)).to.equal(true);
            }
            expect(stopAnimationSpy.callCount).to.equal(0);

            // wait for last interval, and make sure revealCell() has been
            // called the correct number of/ times and stopAnimation() has now
            // been called
            clock.tick(OPEN_CELL_ANIMATION_INTERVAL);
            // (remember, revealCell() was called once for the target cell)
            expect(revealCellStub.callCount).to.equal(ADDITIONAL_CELLS + 1);
            expectedCell.row++;
            expectedCell.column++;
            expect(revealCellStub.calledWith(expectedCell)).to.equal(true);
            expect(stopAnimationSpy.callCount).to.equal(1);
        });
    });

    // would have written tests for other methods if I had more time...
});
