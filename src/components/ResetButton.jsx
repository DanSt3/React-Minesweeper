import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import cx from 'classnames';
import { GameContext } from '../data/GameData';
import GameStateEnum from '../data/GameStateEnum';
import Modal from '../containers/Modal';
import StartGameForm from './StartGameForm';

import styles from './ResetButton.css';

export default class ResetButton extends Component {
    static startNewGame(gameData) {
        gameData.startNewGame(9, 9, 10);
    }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    handleClick() {
        this.setState({ showModal: true });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    render() {
        const { showModal } = this.state;
        return (
            <GameContext.Consumer>
                {(gameData) => {
                    const clickHandler = (!gameData.isAnimationInProgress())
                        ? { onClick: this.handleClick }
                        : {};
                    let buttonData = {
                        text: 'Ready?',
                        style: styles.ready,
                    };
                    const gameState = gameData.getGameState();
                    if (gameState === GameStateEnum.GAME_WON) {
                        buttonData = {
                            text: 'YOU WON!!',
                            style: styles.won,
                        };
                    } else if (gameState === GameStateEnum.GAME_LOST) {
                        buttonData = {
                            text: 'Game Over!',
                            style: styles.lost,
                        };
                    } else if (gameState === GameStateEnum.IN_PROGRESS) {
                        buttonData = {
                            text: 'In Progress...',
                            style: styles.inGame,
                        };
                    }

                    return (
                        <div>
                            <button
                                type="button"
                                className={cx(styles.resetButton,
                                    buttonData.style)}
                                {...clickHandler}
                            >
                                {buttonData.text}
                            </button>
                            <Modal show={showModal}>
                                <StartGameForm
                                    hideFcn={this.hideModal}
                                    lastLevel={gameData.getGameLevel()}
                                    startNewGameFcn={
                                        (row, columns, mines, level) => {
                                            gameData.startNewGame(
                                                row,
                                                columns,
                                                mines,
                                                level,
                                            );
                                            this.hideModal();
                                        }
                                    }
                                />
                            </Modal>
                        </div>
                    );
                }}
            </GameContext.Consumer>
        );
    }
}
