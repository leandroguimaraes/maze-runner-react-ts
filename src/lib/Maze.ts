export class Maze {
  public static generateRoute(
    mazeSize: number,
    startingTile: string,
    exitTile: string,
    walls: Set<string>
  ): string[] {
    return this.generateRouteAux(
      mazeSize,
      startingTile,
      exitTile,
      walls,
      new Set<string>()
    );
  }

  public static generateRouteAux(
    mazeSize: number,
    currTile: string,
    exitTile: string,
    walls: Set<string>,
    currRoute: Set<string>
  ): string[] {
    // if curTile was already visited, do not go ahead with this path
    if (currRoute.has(currTile)) return [];

    // if this is the exit, you won! :)
    if (currTile === exitTile) return [currTile];

    // is currTile a wall?
    if (walls.has(currTile)) return [];

    const coordinates = currTile.split(",");
    const row = Number(coordinates[0]);
    const col = Number(coordinates[1]);

    // is currTile outside of the maze?
    if (row < 0 || col < 0 || row > mazeSize - 1 || col > mazeSize - 1) {
      return [];
    }

    currRoute.add(currTile);

    // north
    let route = this.generateRouteAux(
      mazeSize,
      `${row - 1},${col}`,
      exitTile,
      walls,
      currRoute
    );
    if (route.length) return [...route, currTile];

    // east
    route = this.generateRouteAux(
      mazeSize,
      `${row},${col + 1}`,
      exitTile,
      walls,
      currRoute
    );
    if (route.length) return [...route, currTile];

    // south
    route = this.generateRouteAux(
      mazeSize,
      `${row + 1},${col}`,
      exitTile,
      walls,
      currRoute
    );
    if (route.length) return [...route, currTile];

    // west
    route = this.generateRouteAux(
      mazeSize,
      `${row},${col - 1}`,
      exitTile,
      walls,
      currRoute
    );
    if (route.length) return [...route, currTile];

    return route;
  }
}
