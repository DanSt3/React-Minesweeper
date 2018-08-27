import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import { GameContext } from '../data/GameData';
import Cell from '../components/Cell';

import styles from './Grid.css';

const Grid = () => (
    <GameContext.Consumer>
        {(gameData) => {
            const { cells } = gameData;
            const rows = cells.map((row, rowIndex) => (
                /* (it's okay to use the array indices as keys on this
                    array because they will never be reordered, deleted, etc.) */
                /* eslint-disable react/no-array-index-key */
                <tr key={`GridRow${rowIndex}`}>
                    {row.map((cell, columnIndex) => (
                        <Cell
                            key={`GridCell${rowIndex}-${columnIndex}`}
                            row={rowIndex}
                            column={columnIndex}
                        />
                    ))}
                </tr>
                /* eslint-enable react/no-array-index-key */
            ));

            return (
                <div className={styles.gridContainer}>
                    <table className={styles.gridTable}>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            );
        }}
    </GameContext.Consumer>
);

export default Grid;
