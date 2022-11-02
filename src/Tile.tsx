import "./Tile.scss";

function Tile(props: { size: number }) {
  return (
    <div
      className="tile"
      style={{ width: props.size + "px", height: props.size + "px" }}
    ></div>
  );
}

export default Tile;
