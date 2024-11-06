import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div>
      <h1>Oups! Vous vous êtes perdu....</h1>
      <h2>Voici quelques liens pour retrouver votre chemin:</h2>
      <Link to="/">Home</Link>
    </div>
  );
}
