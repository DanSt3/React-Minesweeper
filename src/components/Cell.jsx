import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

import cx from 'classnames';
import { GameContext } from '../data/GameData';
import styles from './Cell.css';

class Cell extends Component {
    static getColor(value) {
        return cx(Cell.colorStyles[value]);
    }

    render() {
        return (
            <GameContext.Consumer>
                {(gameData) => {
                    const { row, column } = this.props;
                    const cellData = gameData.getCell(row, column);
                    let output = {};
                    if (cellData.isMine()) {
                        output = {
                            value: 'Mine',
                            styles: cx(styles.mine),
                        };
                    } else if (cellData.isMarked()) {
                        output = {
                            value: 'Flag',
                            styles: cx(styles.marked),
                        };
                    } else {
                        const cellValue = cellData.getValue();
                        output = {
                            value: (cellValue > 0) ? cellValue : '',
                            styles: Cell.getColor(cellValue),
                        };
                    }
                    return (
                        <td className={cx(styles.cellSize, styles.revealed, output.styles)}>
                            {output.value}
                        </td>
                    );
                }}
            </GameContext.Consumer>
        );
    }
}

// Defined outside the class so it will effectively be a static data member
// defined only once:
Cell.colorStyles = [null, styles.one, styles.two, styles.three,
    styles.four, styles.five, styles.six, styles.seven,
    styles.eight, styles.nine];

Cell.propTypes = {
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
};

export default Cell;
