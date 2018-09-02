import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

// import styles from './StartGameForm.css';

export default class StartGameForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            choice: Number(event.target.value),
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { startNewGameFcn } = this.props;
        const { choice } = this.state;
        const option = StartGameForm.gameOptions[choice];
        startNewGameFcn(option.rows, option.columns, option.mines);
    }

    render() {
        const { hideFcn } = this.props;
        const { choice } = this.state;
        const radioButtons = StartGameForm.gameOptions.map((option, index) => {
            const description = (option.rows !== 0)
                ? `${option.rows} x ${option.columns}`
                : '';
            const checked = (choice === index);
            return (
                <div>
                    <label htmlFor={option.name}>
                        <input
                            type="radio"
                            id={option.name}
                            name="level"
                            value={index}
                            rows={option.row}
                            columns={option.column}
                            mines={option.mine}
                            checked={checked}
                            onChange={this.handleChange}
                        />
                        {`${option.name}:  ${description}`}
                    </label>
                </div>
            );
        });
        return (
            <form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>
                        Select a difficulty level
                    </legend>
                    {radioButtons}
                </fieldset>
                <button type="button" onClick={() => hideFcn()}>
                    Cancel
                </button>
                <button type="submit">
                    Start Game
                </button>
            </form>
        );
    }
}

// Defined outside the class so it will effectively be a static data member
// defined only once:
StartGameForm.gameOptions = [
    {
        name: 'Easy', rows: 9, columns: 9, mines: 10,
    },
    {
        name: 'Medium', rows: 16, columns: 16, mines: 40,
    },
    {
        name: 'Expert', rows: 30, columns: 16, mines: 99,
    },
    {
        name: 'Custom', rows: 0, columns: 0, mines: 0,
    },
];

StartGameForm.propTypes = {
    hideFcn: PropTypes.func.isRequired,
    startNewGameFcn: PropTypes.func.isRequired,
};
