import './App.css';

import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [titre, setTitre] = useState("");

  const chargerTasks = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  const ajouterTask = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ titre })
    });
    setTitre("");
    chargerTasks();
  };

  const toggleComplete = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, { method:"PUT" });
    chargerTasks();
  };

  const supprimerTask = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, { method:"DELETE" });
    chargerTasks();
  };

  useEffect(() => { chargerTasks(); }, []);

  return (
    <div style={{ padding:"20px" }}>
      <div className="App">
      <h2>Mini To-Do List MERN</h2>

      <input placeholder="Nouvelle tâche" value={titre} onChange={e=>setTitre(e.target.value)} />
      <button onClick={ajouterTask}>Ajouter</button>
        <ul>
          {tasks.map(t => (
            <li key={t._id}>
              <span 
                className={t.complete ? "completed" : ""}
                onClick={()=>toggleComplete(t._id)}
              >
                {t.titre}
              </span>
              <button onClick={()=>supprimerTask(t._id)}>❌</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;


