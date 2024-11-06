export default function useDiceThrow() {
  const diceThrow = async (game_id, nb_dices) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/game/dice_throw/" + game_id + "/" + nb_dices,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: game_id,
            nb_dices: nb_dices,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  return { diceThrow };
}
