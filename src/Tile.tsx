import "./Tile.scss";

function Tile(props: any) {
  const size: number = props.size;

  return (
    <div
      className="tile"
      style={{ width: size + "px", height: size + "px" }}
    ></div>
  );
}

export default Tile;
