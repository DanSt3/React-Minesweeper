import React, { Component, createRef } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

import CustomGameLevel from './CustomGameLevel';
import GameLevelEnum from '../data/GameLevelEnum';
// import styles from './StartGameForm.css';

export default class StartGameForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: StartGameForm.gameOptions
                .findIndex(option => option.level === props.lastLevel),
        };
        this.customParameters = createRef();

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
        if (option.level !== GameLevelEnum.CUSTOM) {
            startNewGameFcn(option.rows, option.columns, option.mines,
                option.level);
        } else {
            const {
                rows,
                columns,
                mines,
            } = this.customParameters.current.state;
            startNewGameFcn(rows, columns, mines, option.level);
        }
    }

    isCustomParametersEnabled() {
        const { choice } = this.state;
        const { level } = StartGameForm.gameOptions[choice];
        return (level === GameLevelEnum.CUSTOM);
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
                <div key={option.name}>
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
                    {(option.level === GameLevelEnum.CUSTOM)
                        ? (
                            <CustomGameLevel
                                ref={this.customParameters}
                                disabled={!this.isCustomParametersEnabled()}
                            />
                        )
                        : null}
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
                    Start New Game
                </button>
            </form>
        );
    }
}

// Defined outside the class so it will effectively be a static data member
// defined only once:
StartGameForm.gameOptions = [
    {
        level: GameLevelEnum.EASY,
        name: 'Easy',
        rows: 9,
        columns: 9,
        mines: 10,
    },
    {
        level: GameLevelEnum.MEDIUM,
        name: 'Medium',
        rows: 16,
        columns: 16,
        mines: 40,
    },
    {
        level: GameLevelEnum.EXPERT,
        name: 'Expert',
        rows: 30,
        columns: 16,
        mines: 99,
    },
    {
        level: GameLevelEnum.CUSTOM,
        name: 'Custom',
        rows: 0,
        columns: 0,
        mines: 0,
    },
];

StartGameForm.propTypes = {
    hideFcn: PropTypes.func.isRequired,
    lastLevel: PropTypes.instanceOf(GameLevelEnum),
    startNewGameFcn: PropTypes.func.isRequired,
};

StartGameForm.defaultProps = {
    lastLevel: 0,
};
