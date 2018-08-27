import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';

import Game from './containers/Game';
import GameData, { GameContext } from './data/GameData';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameData: new GameData(9, 9, 20, (newGameData) => {
                this.setState({ gameData: newGameData });
            }),
        };
    }

    render() {
        const { gameData } = this.state;
        return (
            <GameContext.Provider value={gameData}>
                <Game />
            </GameContext.Provider>
        );
    }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
