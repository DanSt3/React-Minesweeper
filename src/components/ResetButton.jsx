import React from 'react'; // eslint-disable-line no-unused-vars

import { GameContext } from '../data/GameData';
import GameStateEnum from '../data/GameStateEnum';
// import styles from './ResetButton.css';

const ResetButton = () => (
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
                    <button type="button">
                        {buttonText}
                    </button>
                </div>
            );
        }}
    </GameContext.Consumer>
);

export default ResetButton;
