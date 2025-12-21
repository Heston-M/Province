import { GameConfig } from "@/types/gameConfig";


export function isValidConfig(config: GameConfig) {
  if (config.boardSize[0] < 3 || config.boardSize[1] < 3) {
    return false;
  }
  if (config.moveLimit < 7) {
    return false;
  }
  if (config.timeLimit < -1) {
    return false;
  }
  if (config.enemyAggression < 0 || config.enemyAggression > 1) {
    return false;
  }
  if (config.randProbabilities.territory < 0 || config.randProbabilities.territory > 1) {
    return false;
  }
  if (config.randProbabilities.fortified < 0 || config.randProbabilities.fortified > 1) {
    return false;
  }
  if (config.randProbabilities.enemy < 0 || config.randProbabilities.enemy > 1) {
    return false;
  }
  if (config.randProbabilities.territory + config.randProbabilities.fortified + config.randProbabilities.enemy !== 1) {
    return false;
  }
  return true;
}