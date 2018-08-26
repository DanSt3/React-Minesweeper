import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

import { GameContext } from '../data/GameData';
// import styles from './Cell.css';

const Cell = props => (
    <GameContext.Consumer>
        {(gameData) => {
            const { row, column } = props;
            return (
                <div>
                    {gameData.getCell(row, column).getValue()}
                </div>
            );
        }}
    </GameContext.Consumer>
);

Cell.propTypes = {
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
};

export default Cell;
