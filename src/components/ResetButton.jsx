import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import { GameContext } from '../data/GameData';
import GameStateEnum from '../data/GameStateEnum';
import Modal from '../containers/Modal';
import StartGameForm from './StartGameForm';

// import styles from './ResetButton.css';

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
                    let buttonText = 'Ready?';
                    const gameState = gameData.getGameState();
                    if (gameState === GameStateEnum.GAME_WON) {
                        buttonText = 'YOU WON!!';
                    } else if (gameState === GameStateEnum.GAME_LOST) {
                        buttonText = 'Game Over!';
                    } else if (gameState === GameStateEnum.IN_PROGRESS) {
                        buttonText = 'In Progress...';
                    }

                    return (
                        <div>
                            <button type="button" onClick={this.handleClick}>
                                {buttonText}
                            </button>
                            <Modal show={showModal}>
                                <StartGameForm
                                    hideFcn={this.hideModal}
                                    startNewGameFcn={
                                        (row, columns, mines) => {
                                            gameData.startNewGame(
                                                row,
                                                columns,
                                                mines,
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
