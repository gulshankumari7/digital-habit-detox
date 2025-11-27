
import { useState } from "react";

function App() {

    const [appName, setAppName] = useState("");
  const [category, setCategory] = useState("Social");
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState("Day");

  const [usageList, setUsageList] = useState([]);

    return (
    <div>
      <h1>Digital Habit Detox Analyzer</h1>
      <p>Apni daily app usage daalo 👇</p>

      <form>
        <input
          type="text"
          placeholder="App Name (Instagram, YouTube...)"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Social">Social</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Study">Study</option>
          <option value="Work">Work</option>
        </select>

        <input
          type="number"
          placeholder="Time spent (minutes)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="Day">Day</option>
          <option value="Night">Night</option>
        </select>

        <button type="button">Add Usage</button>
      </form>
    </div>
  );

}

export default App
