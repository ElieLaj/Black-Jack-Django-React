export default function useCreateGame() {
  const createGame = async (gameName, playerList) => {
    try {
      const response = await fetch("http://10.111.9.24:8000/api/create_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gameName,
          players: playerList,
        }),
      });

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

  return { createGame };
}
