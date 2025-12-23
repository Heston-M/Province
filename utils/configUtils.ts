import { FixedFillConfig, GameConfig, ProbabilitiesFillConfig } from "@/types/gameConfig";

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
    const probabilitiesFillConfig = config.fillConfig as ProbabilitiesFillConfig;
    if (probabilitiesFillConfig.probabilities?.territory < 0 || probabilitiesFillConfig.probabilities?.territory > 1) {
      return false;
    }
    if (probabilitiesFillConfig.probabilities?.fortified < 0 || probabilitiesFillConfig.probabilities?.fortified > 1) {
      return false;
    }
    if (probabilitiesFillConfig.probabilities?.enemy < 0 || probabilitiesFillConfig.probabilities?.enemy > 1) {
      return false;
    }
    if (probabilitiesFillConfig.probabilities?.territory + probabilitiesFillConfig.probabilities?.fortified + probabilitiesFillConfig.probabilities?.enemy !== 1) {
      return false;
    }
    if (probabilitiesFillConfig.probabilities?.maxFortified && probabilitiesFillConfig.probabilities?.maxFortified < 0) {
      return false;
    }
    if (probabilitiesFillConfig.probabilities?.maxEnemy && probabilitiesFillConfig.probabilities?.maxEnemy < 0) {
      return false;
    }
    if (probabilitiesFillConfig.probabilities?.minFortified && probabilitiesFillConfig.probabilities?.minFortified > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
    if (probabilitiesFillConfig.probabilities?.minEnemy && probabilitiesFillConfig.probabilities?.minEnemy > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
    if (probabilitiesFillConfig.probabilities?.minFortified + probabilitiesFillConfig.probabilities?.minEnemy > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
  }
  if (config.fillConfig.type === "fixed") {
    const fixedFillConfig = config.fillConfig as FixedFillConfig;
    if (fixedFillConfig.numbers?.fortified < 0) {
      return false;
    }
    if (fixedFillConfig.numbers?.enemy < 0) {
      return false;
    }
    if (fixedFillConfig.numbers?.fortified + fixedFillConfig.numbers?.enemy > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
  }
  return true;
}