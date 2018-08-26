import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import { GameContext } from '../data/GameData';
import Cell from '../components/Cell';

import styles from './Grid.css';

const Grid = () => (
    <GameContext.Consumer>
        {(gameData) => {
            const { cells } = gameData;
            const rows = cells.map((row, rowIndex) => (
                <tr>
                    {row.map((column, columnIndex) => (
                        <Cell row={rowIndex} column={columnIndex} />
                    ))}
                </tr>
            ));

            return (
                <div className={styles.gridContainer}>
                    <table className={styles.gridTable}>
                        {rows}
                    </table>
                </div>
            );
        }}
    </GameContext.Consumer>
);

export default Grid;
