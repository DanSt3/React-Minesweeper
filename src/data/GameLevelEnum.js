import { Enum } from 'enumify';

class GameLevelEnum extends Enum {}
GameLevelEnum.initEnum(['EASY', 'MEDIUM', 'EXPERT', 'CUSTOM']);

export default GameLevelEnum;
