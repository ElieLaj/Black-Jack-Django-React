export function PlayerRow({ player }) {
    return (
      <tr className="PlayerRow" key={player.id}>
        <th scope="row">{player.id}</th>
        <td>{player.name}</td>
        <td>{player.score}</td>
        <td>{player.out ? "Oui" : "Non"}</td>
      </tr>
    );
}