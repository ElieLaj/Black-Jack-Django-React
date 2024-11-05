import './App.css'
import { Route, Routes, useNavigate, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { Game } from './pages/Game'

function App() {
  const navigate = useNavigate();

  return (
    <>
    {/* <ul>
      <li>
        <button onClick={() => navigate}></button>
      </li>
    </ul> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;