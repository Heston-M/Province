import { GameConfig } from "@/types/gameConfig";


export function isValidConfig(config: GameConfig) {
  if (config.boardSize[0] < 3 || config.boardSize[1] < 3) {
    return false;
  }
  if (config.resourceLimit < 7) {
    return false;
  }
  if (config.timeLimit < -1) {
    return false;
  }
  if (config.enemyAggression < 0 || config.enemyAggression > 1) {
    return false;
  }
  if (config.fillConfig.type === "probabilities") {
    if (config.fillConfig.probabilities?.territory < 0 || config.fillConfig.probabilities?.territory > 1) {
      return false;
    }
    if (config.fillConfig.probabilities?.fortified < 0 || config.fillConfig.probabilities?.fortified > 1) {
      return false;
    }
    if (config.fillConfig.probabilities?.enemy < 0 || config.fillConfig.probabilities?.enemy > 1) {
      return false;
    }
    if (config.fillConfig.probabilities?.territory + config.fillConfig.probabilities?.fortified + config.fillConfig.probabilities?.enemy !== 1) {
      return false;
    }
    if (config.fillConfig.probabilities?.maxFortified && config.fillConfig.probabilities?.maxFortified < 0) {
      return false;
    }
    if (config.fillConfig.probabilities?.maxEnemy && config.fillConfig.probabilities?.maxEnemy < 0) {
      return false;
    }
    if (config.fillConfig.probabilities?.minFortified && config.fillConfig.probabilities?.minFortified > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
    if (config.fillConfig.probabilities?.minEnemy && config.fillConfig.probabilities?.minEnemy > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
  }
  if (config.fillConfig.type === "fixed") {
    if ("numbers" in config.fillConfig && config.fillConfig.numbers?.fortified < 0) {
      return false;
    }
    if ("numbers" in config.fillConfig && config.fillConfig.numbers?.enemy < 0) {
      return false;
    }
    if ("numbers" in config.fillConfig && config.fillConfig.numbers?.fortified + config.fillConfig.numbers?.enemy > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
  }
  return true;
}