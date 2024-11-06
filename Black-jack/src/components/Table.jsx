import { PlayerRow } from './PlayerRow';

export function Table({game}) {
    const players = game.players;
    return (
      <div className="TableContainer">
        <table className="PlayerTable">
          <caption>Tableau des joueurs de la partie: {game.name}</caption>
          <thead className="PlayerTableHeader">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nom du joueur</th>
              <th scope="col">Score</th>
              <th scope="col">Retiré</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </tbody>
          <tfoot className="PlayerTableBottom">
            <tr>
              <td colSpan="2">Tour</td>
              <td colSpan="2">
                {game.turn}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
}