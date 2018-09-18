# React-Minesweeper

## How to install and run:
1. `git clone` this repository to your local computer
1. Run `yarn install` to download all the dependencies.  This may take several minutes.
1. Run `yarn start` begin the game server
1. Open your web browser to `http://localhost:8080/`.  The game should come up and you can begin!

## How to play:
- The button on the top of the window allows you to start a new game and select game options
- Left-click a square to uncover it
- Shift-left-click a square to mark it as mine
- You win the game when you have uncovered all the squares without mines in them.
- You lose if you uncover a mine!
- If you uncover a square that has no mines adjacent to it, it will automatically uncover all the squares adjacent to it.  And if any of those square have no adjacent mines, they too will uncover their adjacent squares!

## Notes:
- This web application does not support IE 11 or earlier versions of the IE web browser or the Opera Mini web browser.

## Tech Stack used:
- React 16
- Babel transpiler version 6, so I can use ES6 syntax on almost any browser version
- CSS Modules for separating CSS per component
- ESLint using most of AirBnb's coding standards for keeping clean, consistent code
- Webpack version 4 as the module bundler / local test server
- Yarn dependency manager and script runner - faster than NPM
- Mocha, Chai, Sinon, and Enzyme for unit testing

## Design Notes:
- I used "React Context" for holding the game state because I wanted an opportunity to learn it.  The state could just as well be managed by many other frameworks such as Redux or Relay or even the passing Props and Ref callbacks between components (yuck!).

## To run the unit tests:
- Type `yarn test`
 