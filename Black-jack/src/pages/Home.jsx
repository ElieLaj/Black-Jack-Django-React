import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import '../App.jsx'
import { CounterButton } from '../components/CounterButton.jsx'
import { Table } from '../components/Table.jsx'
import { TaskManager } from '../components/TaskManager.jsx'


const players = [
  { id: 1, name: 'Player 1', score: 30 },
  { id: 2, name: 'Player 2', score: 10 },
]

export function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <CounterButton />
        <Table players={players} />
        <TaskManager />
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
