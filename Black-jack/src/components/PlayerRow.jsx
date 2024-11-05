export function PlayerRow({ player }) {
    return (
        <tr className="PlayerRow" >
            <th scope="row">{ player.id }</th>
            <td>{ player.name }</td>
            <td>{ player.score }</td>
        </tr>
    )
}