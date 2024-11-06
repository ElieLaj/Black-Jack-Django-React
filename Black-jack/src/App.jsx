import './App.css'
import { Route, Routes, useNavigate, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { NotFound } from "./pages/NotFound";
import dices from "./assets/dices.png";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className="TitleContainer">
        <img src={dices} alt="" />
        <h1>Black Jack</h1>
        <img src={dices} alt="" />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;