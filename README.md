# Province
Created: 12/17/2025

Author: Heston Montagne

This is a React Native app that runs a casual game about gaining territory on a board.

## Game Rules
The game works by capturing territory tiles. You can capture tiles by selecting them.
Each tile can be one of a few different types, indicated by its color. 

### Uncaptured (grey)
This tile is unclaimed by anyone. Select it to capture it. 

### Territory (brown -> green)
This tile has been captured by you. It will start brown and slowly change to green. After 6 turns it becomes Harvestable.

### Harvestable (bright green)
This tile is ripe with resources. If you select it, it and all surrounding territory spaces will be set to brown, and each such territory will grant you 1 extra move. Harvesting tiles will not advance the enemy nor your other Territory tiles.

If you don't select the Harvestable tile, it will turn into a Fortified tile.

### Fortified (blue)
This tile is protected against attacks. The enemy cannot capture it.

### Enemy (red)
This tile is an enemy territory. You can capture it by selecting it. However, capturing an Enemy tile costs 1 extra move, unless a Fortified tile is adjacent to it. 

After each player move, a random Uncaptured or Territory tile that is adjacent to an Enemy tile will be captured by the enemy, turning it into another Enemy tile.