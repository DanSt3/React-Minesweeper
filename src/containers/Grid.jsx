import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import Cell from '../components/Cell';

// import styles from './Grid.css';

class Grid extends Component {
    render() {
        const { cells } = this.state;
        const rows = cells.map((row, rowIndex) => (
            <tr>
                {row.map((colum, columnIndex) => (
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
    }
}

export default Grid;
