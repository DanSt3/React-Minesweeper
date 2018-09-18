import React from 'react'; // eslint-disable-line no-unused-vars

import { GameContext } from '../data/GameData';
import styles from './Timer.css';

const Timer = () => (
    <GameContext.Consumer>
        {gameData => (
            <div className={styles.timer}>
                Time:
                <span className={styles.digits}>
                    {gameData.getGameTimeCount()}
                </span>
                &nbsp;seconds
            </div>
        )}
    </GameContext.Consumer>
);

export default Timer;
