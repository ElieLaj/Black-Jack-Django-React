export default function useCreateGame() {
  const createGame = async (gameName) => {
    try {
      const response = await fetch("http://localhost:8000/api/create_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gameName,
          players: ["Moi", "2lie", "Arthurochrome", "Tim2o"],
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
