export default function useFetchGame() {
  const fetchGame = async (gameId, ip) => {
    try {
      const response = await fetch(`http://${ip}:8000/api/game/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
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

  return { fetchGame };
}
