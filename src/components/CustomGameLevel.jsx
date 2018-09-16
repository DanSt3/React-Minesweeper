import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './CustomGameLevel.css';

export default class CustomGameLevel extends Component {
    static calculateMaxMines(rows, columns) {
        return (rows - 1) * (columns - 1);
    }

    constructor(props) {
        super(props);
        this.customRanges = this.getCustomRanges();
        const rowData = this.findData('rows');
        const columnData = this.findData('columns');
        const mineData = this.findData('mines');
        this.state = {
            rows: rowData.default,
            columns: columnData.default,
            mines: mineData.default,
            maxMines: CustomGameLevel.calculateMaxMines(rowData.default,
                columnData.default),
        };
    }

    getCustomRanges() {
        return [
            {
                id: 'rows',
                label: 'Rows:',
                min: 9,
                getMax: () => 30,
                default: 9,
                getValue: () => {
                    const { rows } = this.state;
                    return rows;
                },
                onChange: this.handleRowChange.bind(this),
            },
            {
                id: 'columns',
                label: 'Columns:',
                min: 9,
                getMax: () => 24,
                default: 9,
                getValue: () => {
                    const { columns } = this.state;
                    return columns;
                },
                onChange: this.handleColumnChange.bind(this),
            },
            {
                id: 'mines',
                label: 'Mines:',
                min: 9,
                getMax: () => {
                    const { maxMines } = this.state;
                    return maxMines;
                },
                default: 9,
                getValue: () => {
                    const { mines } = this.state;
                    return mines;
                },
                onChange: this.handleMinesChange.bind(this),
            },
        ];
    }

    findData(id) {
        return this.customRanges.find(data => data.id === id);
    }

    updateMaxMines(rows, columns) {
        const { mines } = this.state;
        const newMaxMines = CustomGameLevel.calculateMaxMines(rows, columns);
        const newMines = (mines > newMaxMines) ? newMaxMines : mines;
        return { newMines, newMaxMines };
    }

    handleRowChange(event) {
        const newRows = Number(event.target.value);
        const { columns } = this.state;
        const { newMines, newMaxMines } = this.updateMaxMines(newRows, columns);
        this.setState({
            rows: newRows,
            mines: newMines,
            maxMines: newMaxMines,
        });
    }

    handleColumnChange(event) {
        const newColumns = Number(event.target.value);
        const { rows } = this.state;
        const { newMines, newMaxMines } = this.updateMaxMines(rows, newColumns);
        this.setState({
            columns: newColumns,
            mines: newMines,
            maxMines: newMaxMines,
        });
    }

    handleMinesChange(event) {
        this.setState({ mines: Number(event.target.value) });
    }

    renderParameters() {
        return this.customRanges.map(item => (
            <div key={item.id}>
                <label htmlFor={item.id}>
                    {item.label}
                    &nbsp;
                    <input
                        type="range"
                        id={item.id}
                        min={item.min}
                        max={item.getMax()}
                        step="1"
                        value={item.getValue()}
                        onChange={item.onChange}
                    />
                    <input
                        type="number"
                        readOnly
                        min={item.min}
                        max={item.getMax()}
                        value={item.getValue()}
                    />
                </label>
            </div>
        ));
    }

    render() {
        const { disabled } = this.props;
        return (
            <fieldset
                disabled={disabled}
                className={cx(
                    styles.customLevel,
                    (disabled) ? styles.disabled : null,
                )}
            >
                <legend>
                    Choose Custom Parameters:
                </legend>
                {this.renderParameters()}
            </fieldset>
        );
    }
}

CustomGameLevel.propTypes = {
    disabled: PropTypes.bool.isRequired,
};
