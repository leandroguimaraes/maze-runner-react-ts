import { useRef, useState } from "react";
import { Maze } from "./lib/Maze";
import "./Maze.scss";
import Tile from "./Tile";

function MazePage() {
  enum MazeState {
    DefineMazeSize,
    SelectStartingPoint,
    SelectExitPoint,
    Play,
  }

  enum TileType {
    Starting,
    Exit,
    Wall,
    Path,
    Route,
  }

  const tileSize = 40;

  const mazeSizeInput = useRef<HTMLInputElement>(null);
  const [mazeSize, setMazeSize] = useState(0);

  const [startingTile, setStartingTile] = useState("");
  const [exitTile, setExitTile] = useState("");

  const [walls, setWalls] = useState(new Set<string>());
  const [route, setRoute] = useState(new Set<string>());

  const [currMazeState, setCurrMazeState] = useState(MazeState.DefineMazeSize);

  const [hasNoSolution, setHasNoSolutionState] = useState(false);

  function onCreateMazeClick(): void {
    const mazeSize = Number(mazeSizeInput.current?.value);
    if (mazeSize > 0) {
      setMazeSize(mazeSize);
      setCurrMazeState(MazeState.SelectStartingPoint);
    }
  }

  function onTileClick(row: number, col: number): void {
    const currTile = `${row},${col}`;
    const currWalls = new Set<string>(walls.keys());

    if (currMazeState !== MazeState.Play) {
      if (!startingTile) {
        setStartingTile(currTile);
        setCurrMazeState(MazeState.SelectExitPoint);
      } else if (!exitTile && currTile !== startingTile) {
        setExitTile(currTile);
        setCurrMazeState(MazeState.Play);
      }
    } else {
      if (currTile !== startingTile && currTile !== exitTile) {
        if (currWalls.has(currTile)) {
          currWalls.delete(currTile);
        } else {
          currWalls.add(currTile);
        }
      }

      route.clear();
      setWalls(currWalls);
    }
  }

  function onEscapeClick(): void {
    const route = Maze.generateRoute(mazeSize, startingTile, exitTile, walls);
    setHasNoSolutionState(route.length === 0);

    setRoute(new Set<string>(route));
  }

  function getTileType(row: number, col: number): TileType {
    if (startingTile === `${row},${col}`) return TileType.Starting;
    if (exitTile === `${row},${col}`) return TileType.Exit;
    if (walls.has(`${row},${col}`)) return TileType.Wall;
    if (route.has(`${row},${col}`)) return TileType.Route;

    return TileType.Path;
  }

  function Board(): JSX.Element {
    const noSelection = new Set<string>();
    if (currMazeState !== MazeState.Play) {
      for (let row = 1; row < mazeSize - 1; row++) {
        for (let col = 1; col < mazeSize - 1; col++) {
          noSelection.add(`${row},${col}`);
        }
      }
    }

    const newTiles = [];
    for (let row = 0; row < mazeSize; row++) {
      for (let col = 0; col < mazeSize; col++) {
        const tileType = getTileType(row, col);

        newTiles.push(
          <div
            onClick={() => onTileClick(row, col)}
            className={`tile-wrapper ${
              noSelection.has(`${row},${col}`) ? "no-selection" : ""
            } ${tileType === TileType.Starting ? "starting-tile" : ""} ${
              tileType === TileType.Exit ? "exit-tile" : ""
            } ${tileType === TileType.Wall ? "wall-tile" : ""} ${
              tileType === TileType.Route ? "route-tile" : ""
            }`}
            key={`${row},${col}`}
          >
            <Tile size={tileSize} />
          </div>
        );
      }
    }

    return <>{newTiles}</>;
  }

  return (
    <>
      {currMazeState === MazeState.DefineMazeSize ? (
        <>
          <div>
            Define your maze size:
            <input
              ref={mazeSizeInput}
              type="number"
              defaultValue="20"
              className="maze-size"
            ></input>
          </div>
          <button className="btn-create-maze" onClick={onCreateMazeClick}>
            Create Maze
          </button>
        </>
      ) : currMazeState === MazeState.SelectStartingPoint ? (
        <div>Select a starting point.</div>
      ) : currMazeState === MazeState.SelectExitPoint ? (
        <div>Select an exit point.</div>
      ) : (
        <>
          <p>Freely create your maze then click "Escape!" when you're done.</p>
          <button onClick={onEscapeClick}>Escape!</button>
        </>
      )}
      {hasNoSolution && (
        <>
          <br />
          <p className="no-solution">You're trapped! There is no way out!</p>
        </>
      )}
      {mazeSize > 0 && (
        <div
          className="maze"
          style={{
            width: mazeSize * tileSize + mazeSize - 1 + "px",
            height: mazeSize * tileSize + mazeSize - 1 + "px",
          }}
        >
          <Board />
        </div>
      )}
    </>
  );
}

export default MazePage;
