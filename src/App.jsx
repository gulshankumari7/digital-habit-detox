import { useState, useEffect } from "react";

function App() {
  // -------- States --------
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState("Social");
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState("Day");

  const [usageList, setUsageList] = useState([]);
  const [detoxScore, setDetoxScore] = useState(100);

  const [habitStatus, setHabitStatus] = useState("");
  const [suggestion, setSuggestion] = useState("");

  // -------- Detox Score Logic --------
  function calculateDetoxScore(list) {
    let score = 100;

    list.forEach((item) => {
      const t = Number(item.time);

      // Social media overuse
      if (item.category === "Social" && t > 60) {
        score -= 10;
      }

      // Entertainment overuse
      if (item.category === "Entertainment" && t > 90) {
        score -= 10;
      }

      // Night usage penalty
      if (item.period === "Night" && t > 30) {
        score -= 10;
      }

      // Study / Work bonus
      if (
        (item.category === "Study" || item.category === "Work") &&
        t >= 60
      ) {
        score += 5;
      }
    });

    // clamp 0–100
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return score;
  }

  // -------- Status & Suggestion --------
  function updateStatusAndSuggestion(score) {
    if (score >= 80) {
      setHabitStatus("🟢 Healthy Digital Habits");
      setSuggestion(
        "Great job! Bas raat me thoda screen time control rakho ✔️"
      );
    } else if (score >= 50) {
      setHabitStatus("🟡 At-Risk Digital Habits");
      setSuggestion(
        "Social / entertainment usage 20–30 min kam karo aur night usage avoid karo."
      );
    } else {
      setHabitStatus("🔴 Digital Addiction Risk");
      setSuggestion(
        "Strong detox recommend: phone-free time set karo, especially night me."
      );
    }
  }

  // ✅ AUTO update status whenever score changes
  useEffect(() => {
    updateStatusAndSuggestion(detoxScore);
  }, [detoxScore]);

  // -------- Add Usage --------
  function handleAddUsage() {
    if (!appName || !time) {
      alert("Please app name aur time enter karo 🙂");
      return;
    }

    const newUsage = {
      appName,
      category,
      time,
      period,
    };

    const updatedList = [...usageList, newUsage];
    setUsageList(updatedList);

    const newScore = calculateDetoxScore(updatedList);
    setDetoxScore(newScore);

    // reset inputs
    setAppName("");
    setTime("");
  }

  // -------- UI --------
  return (
    <div>
      <h1>📱 Digital Habit Detox Analyzer</h1>
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

        <button type="button" onClick={handleAddUsage}>
          Add Usage
        </button>
      </form>

      {/* Detox Score */}
      <h2>Detox Score</h2>
      <h1>{detoxScore} / 100</h1>

      <h3>{habitStatus}</h3>
      <p>{suggestion}</p>

      {/* Usage List */}
      <h2>Daily Usage List</h2>
      {usageList.length === 0 ? (
        <p>No data added yet</p>
      ) : (
        <ul>
          {usageList.map((item, index) => (
            <li key={index}>
              {item.appName} – {item.category} – {item.time} min – {item.period}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
