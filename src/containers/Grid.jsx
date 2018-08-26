import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import { GameContext } from '../data/GameData';
import Cell from '../components/Cell';

// import styles from './Grid.css';

const Grid = () => (
    <GameContext.Consumer>
        {(gameData) => {
            const { cells } = gameData;
            const rows = cells.map((row, rowIndex) => (
                <tr>
                    {row.map((column, columnIndex) => (
                        <td>
                            <Cell row={rowIndex} column={columnIndex} />
                        </td>
                    ))}
                </tr>
            ));

            return (
                <table>
                    {rows}
                </table>
            );
        }}
    </GameContext.Consumer>
);

export default Grid;
