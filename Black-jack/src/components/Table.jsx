import { PlayerRow } from './PlayerRow';

export function Table({game}) {
    console.log(game);
    const players = game.players;
    return (
        <div className='TableContainer'>
            <table className='PlayerTable'>
                <caption>
                    Tableau des joueurs de la partie: {game.name}
                </caption>
                <thead className="PlayerTableHeader">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nom du joueur</th>
                        <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        players.map((player) => (
                            <PlayerRow key={ player.id } player={player} />
                        ))
                    }
                </tbody>
                <tfoot className='PlayerTableBottom'>
                    <tr>
                        <td colSpan="2">Total</td>
                        <td>
                            {players.reduce((acc, player) => acc + player.score, 0)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}