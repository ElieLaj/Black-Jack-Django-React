import { useState } from "react";

export function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <div>
      <div className="ButtonHolder">
        <input
          type="text"
          onChange={(e) => {
            setTask({ name: e.target.value, done: false });
          }}
        />
        <button
          onClick={() => {
            if (!task) return;
            setTasks([...tasks, task]);
            setTask("");
            setErrorMessage("");
          }}
        >
          Ajouter une tâche
        </button>
      </div>
      <div>
        <h2>{errorMessage}</h2>
        <ul className="List">
          {tasks.map((task, index) => (
            <li key={index}>
              <p>Nom: {task.name}</p>
              <input type="checkbox" checked={task.done} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
