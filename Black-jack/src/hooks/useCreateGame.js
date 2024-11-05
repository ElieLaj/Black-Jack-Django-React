export default function useCreateGame() {
    const createGame = () => {
        fetch("http://localhost:8000/api/create_game", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Black Jack",
            players: ["Tim2o", "2lie", "Arthurochrome"],
          }),
        })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    return { createGame } ;
}

