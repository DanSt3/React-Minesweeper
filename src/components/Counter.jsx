import React from 'react'; // eslint-disable-line no-unused-vars

import { GameContext } from '../data/GameData';
import styles from './Counter.css';

const Counter = () => (
    <GameContext.Consumer>
        {gameData => (
            <div className={styles.counter}>
                <span className={styles.digits}>
                    {gameData.getMinesRemaining()}
                </span>
                &nbsp;Mines Remaining
            </div>
        )}
    </GameContext.Consumer>
);

export default Counter;
