import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

import cx from 'classnames';
import { GameContext } from '../data/GameData';
import styles from './Cell.css';

class Cell extends Component {
    constructor(props) {
        super(props);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    static getColor(value) {
        return cx(Cell.colorStyles[value]);
    }

    static getCellOutput(cellData) {
        let output = {};
        if (cellData.isMarked()) {
            output = {
                value: 'Flag',
                styles: cx(styles.hidden, styles.marked),
            };
        } else if (!cellData.isRevealed()) {
            output = {
                value: '',
                styles: cx(styles.hidden),
            };
        } else if (cellData.isMine()) {
            output = {
                value: 'Mine',
                styles: cx(styles.revealed, styles.mine),
            };
        } else {
            const cellValue = cellData.getValue();
            output = {
                value: (cellValue > 0) ? cellValue : '',
                styles: cx(styles.revealed, Cell.getColor(cellValue)),
            };
        }
        return output;
    }

    handleClick(gameData, event) {
        const { row, column } = this.props;
        if (event.shiftKey) {
            gameData.toggleMark(row, column);
        } else {
            gameData.revealCell(row, column);
        }
        event.stopPropagation();
    }

    handleKeyUp(evt) {
        const { row, column } = this.props;
        console.log(`KeyUp Detected at (${row} ,${column}): evt=${evt} `); // eslint-disable-line no-console
    }

    render() {
        return (
            <GameContext.Consumer>
                {(gameData) => {
                    const { row, column } = this.props;
                    const cellData = gameData.getCell(row, column);
                    const output = Cell.getCellOutput(cellData);
                    /* (not worrying about accessibility for now - this could
                        be fixed by making the cells an interactive element
                        like a button or a href, or by adding selection
                        highlighting and key handling to replacve the mouse
                        clicks) */
                    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-noninteractive-tabindex */
                    return (
                        <td
                            className={cx(styles.cellSize, output.styles)}
                            onClick={event => this.handleClick(gameData, event)} // Inefficient - binds a new handler instance on each render, but no better way to pass the gameData parameter
                            onKeyUp={this.handleKeyUp}
                            tabIndex="0"
                        >
                            {output.value}
                        </td>
                    );
                    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-noninteractive-tabindex */
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
