import React from 'react'; // eslint-disable-line no-unused-vars

import { GameContext } from '../data/GameData';
// import styles from './Timer.css';

const Timer = () => (
    <GameContext.Consumer>
        {gameData => (
            <div>
                {`Timer: ${gameData.getGameTimeCount()} sec`}
            </div>
        )}
    </GameContext.Consumer>
);

export default Timer;
