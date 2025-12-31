import { FixedFillConfig, GameConfig, ProbabilitiesFillConfig } from "@/types/gameConfig";

export function isValidConfig(config: GameConfig) {
  // check board size
  if (config.boardSize[0] < 3 || config.boardSize[1] < 3) {
    return false;
  }
  // check resource limit
  if (config.resourceLimit < 7) {
    return false;
  }
  // check time limit
  if (config.timeLimit < -1) {
    return false;
  }
  // check enemy aggression
  if (config.enemyAggression < 0 || config.enemyAggression > 1) {
    return false;
  }
  // check fill config
  if (config.fillConfig.type === "probabilities") {
    const probabilitiesFillConfig = config.fillConfig as ProbabilitiesFillConfig;
    // territory probability between 0 and 1
    if (probabilitiesFillConfig.probabilities?.territory < 0 || probabilitiesFillConfig.probabilities?.territory > 1) {
      return false;
    }
    // fortified probability between 0 and 1
    if (probabilitiesFillConfig.probabilities?.fortified < 0 || probabilitiesFillConfig.probabilities?.fortified > 1) {
      return false;
    }
    // enemy probability between 0 and 1
    if (probabilitiesFillConfig.probabilities?.enemy < 0 || probabilitiesFillConfig.probabilities?.enemy > 1) {
      return false;
    }
    // obstacle probability between 0 and 1
    if (probabilitiesFillConfig.probabilities?.obstacle < 0 || probabilitiesFillConfig.probabilities?.obstacle > 1) {
      return false;
    }
    // sum of probabilities must be 1
    if (probabilitiesFillConfig.probabilities?.territory + probabilitiesFillConfig.probabilities?.fortified + probabilitiesFillConfig.probabilities?.enemy + probabilitiesFillConfig.probabilities?.obstacle !== 1) {
      return false;
    }
    // max fortified must be at least 0
    if (probabilitiesFillConfig.probabilities?.maxFortified && probabilitiesFillConfig.probabilities?.maxFortified < 0) {
      return false;
    }
    // max enemy must be at least 0
    if (probabilitiesFillConfig.probabilities?.maxEnemy && probabilitiesFillConfig.probabilities?.maxEnemy < 0) {
      return false;
    }
    // max obstacle must be at least 0
    if (probabilitiesFillConfig.probabilities?.maxObstacle && probabilitiesFillConfig.probabilities?.maxObstacle < 0) {
      return false;
    }
    // sum of min values must be less than the board size
    if (probabilitiesFillConfig.probabilities?.minFortified + probabilitiesFillConfig.probabilities?.minEnemy > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
    // min fortified must be less than the board size
    if (probabilitiesFillConfig.probabilities?.minFortified && probabilitiesFillConfig.probabilities?.minFortified > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
    // min enemy must be less than the board size
    if (probabilitiesFillConfig.probabilities?.minEnemy && probabilitiesFillConfig.probabilities?.minEnemy > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
    // min obstacle must be less than the board size
    if (probabilitiesFillConfig.probabilities?.minObstacle && probabilitiesFillConfig.probabilities?.minObstacle > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
  }
  if (config.fillConfig.type === "fixed") {
    const fixedFillConfig = config.fillConfig as FixedFillConfig;
    // fortified must be at least 0
    if (fixedFillConfig.numbers?.fortified < 0) {
      return false;
    }
    // enemy must be at least 0
    if (fixedFillConfig.numbers?.enemy < 0) {
      return false;
    }
    // obstacle must be at least 0
    if (fixedFillConfig.numbers?.obstacle < 0) {
      return false;
    }
    // sum of numbers must be less than the board size
    if (fixedFillConfig.numbers?.fortified + fixedFillConfig.numbers?.enemy + fixedFillConfig.numbers?.obstacle > config.boardSize[0] * config.boardSize[1]) {
      return false;
    }
  }
  return true;
}