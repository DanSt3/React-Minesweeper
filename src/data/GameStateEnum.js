import { Enum } from 'enumify';

class GameStateEnum extends Enum {}
GameStateEnum.initEnum(['NOT_STARTED', 'IN_PROGRESS', 'GAME_WON', 'GAME_LOST']);

export default GameStateEnum;
