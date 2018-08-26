import React from 'react';

import Grid from './Grid';
import Header from './Header';

import styles from './Game.css';

const Game = () => (
    <div className={styles.game}>
        <Header />
        <Grid />
    </div>
);

export default Game;
