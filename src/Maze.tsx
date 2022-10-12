import { useState } from "react";
import "./Maze.scss";
import Tile from "./Tile";

function Maze() {
  enum MazeState {
    SelectStartingEndPoints,
    Play,
  }

  enum TileType {
    Starting,
    Exit,
    Wall,
    Path,
  }

  let currMazeState = MazeState.Play;

  const tileSize = 40;

  const mazeWidth = 5;
  const mazeHeight = 5;

  let startingTile = "4,0";
  let exitTile = "1,4";

  let walls = new Set<string>(["0,1", "2,2"]);

  const [tiles, setTiles] = useState(
    buildMaze(currMazeState, mazeWidth, mazeHeight)
  );

  function onTileClick(row: number, col: number): void {
    console.log(`${row} - ${col}`);
    setTiles(tiles);
  }

  function getTileType(row: number, col: number): TileType {
    if (startingTile === `${row},${col}`) return TileType.Starting;
    if (exitTile === `${row},${col}`) return TileType.Exit;
    if (walls.has(`${row},${col}`)) return TileType.Wall;

    return TileType.Path;
  }

  function buildMaze(
    mazeState: MazeState,
    width: number,
    height: number
  ): any[] {
    const noSelection = new Set<string>();
    if (mazeState === MazeState.SelectStartingEndPoints) {
      for (let row = 1; row < width - 1; row++) {
        for (let col = 1; col < height - 1; col++) {
          noSelection.add(`${row},${col}`);
        }
      }
    }

    const newTiles = [];
    for (let row = 0; row < width; row++) {
      for (let col = 0; col < height; col++) {
        const tileType = getTileType(row, col);

        newTiles.push(
          <div
            onClick={() => onTileClick(row, col)}
            className={`tile-wrapper ${
              noSelection.has(`${row},${col}`) ? "no-selection" : ""
            } ${tileType === TileType.Starting ? "starting-tile" : ""} ${
              tileType === TileType.Exit ? "exit-tile" : ""
            } ${tileType === TileType.Wall ? "wall-tile" : ""}`}
            key={`${row},${col}`}
          >
            <Tile size={tileSize} />
          </div>
        );
      }
    }

    return newTiles;
  }

  return (
    <div
      className="maze"
      style={{
        width: mazeWidth * tileSize + mazeWidth - 1 + "px",
        height: mazeHeight * tileSize + mazeHeight - 1 + "px",
      }}
    >
      {tiles}
    </div>
  );
}

export default Maze;
