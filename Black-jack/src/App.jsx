import './App.css'
import { Route, Routes, useNavigate, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { NotFound } from "./pages/NotFound";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;