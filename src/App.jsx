import { useState, useEffect } from "react";

function App() {
  // -------- Chatbot States --------
  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");

  // -------- App Usage States --------
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

      if (item.category === "Social" && t > 60) score -= 10;
      if (item.category === "Entertainment" && t > 90) score -= 10;
      if (item.period === "Night" && t > 30) score -= 10;

      if (
        (item.category === "Study" || item.category === "Work") &&
        t >= 60
      ) {
        score += 5;
      }
    });

    return Math.min(100, Math.max(0, score));
  }

  // -------- Status & Suggestion --------
  function updateStatusAndSuggestion(score) {
    if (score >= 80) {
      setHabitStatus("🟢 Healthy Digital Habits");
      setSuggestion(
        "You have a balanced digital routine. Continue limiting late-night usage to stay productive."
      );
    } else if (score >= 50) {
      setHabitStatus("🟡 At-Risk Digital Habits");
      setSuggestion(
        "Your screen time is increasing. Reduce social and entertainment usage and avoid late-night scrolling."
      );
    } else {
      setHabitStatus("🔴 Digital Addiction Risk");
      setSuggestion(
        "High digital dependency detected. Set daily screen limits and create phone-free time at night."
      );
    }
  }

  useEffect(() => {
    updateStatusAndSuggestion(detoxScore);
  }, [detoxScore]);

  // -------- Add Usage --------
  function handleAddUsage() {
    if (!appName || !time) {
      alert("Please enter app name and time 🙂");
      return;
    }

    const updatedList = [
      ...usageList,
      { appName, category, time, period },
    ];

    setUsageList(updatedList);
    setDetoxScore(calculateDetoxScore(updatedList));

    setAppName("");
    setTime("");
  }

  // -------- Chatbot Logic --------
  function handleChat() {
    const msg = chatInput.toLowerCase();

    if (msg.includes("reduce")) {
      setChatReply("Start by reducing 15–20 minutes of social media per day.");
    } else if (msg.includes("night")) {
      setChatReply("Avoid screen usage at least 30 minutes before bedtime.");
    } else if (msg.includes("score")) {
      setChatReply(
        `Your current Detox Score is ${detoxScore}. Aim for 80+ for healthy habits.`
      );
    } else {
      setChatReply(
        "I can help with digital detox tips. Ask me about screen time, night usage, or improving your score."
      );
    }

    setChatInput("");
  }

  // -------- UI --------
  return (
    <div className="container">
      <h1>📱 Digital Habit Detox Analyzer</h1>
      <p className="subtitle">
        Enter your daily app usage and get personalized digital wellness feedback
      </p>

      <form>
        <input
          type="text"
          placeholder="App Name"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Social</option>
          <option>Entertainment</option>
          <option>Study</option>
          <option>Work</option>
        </select>

        <input
          type="number"
          placeholder="Minutes"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option>Day</option>
          <option>Night</option>
        </select>

        <button type="button" onClick={handleAddUsage}>
          Add Usage
        </button>
      </form>

      <div className="card">
        <h2>Detox Score</h2>
        <div className="score">{detoxScore} / 100</div>
        <h3>{habitStatus}</h3>
        <p>{suggestion}</p>
      </div>

      <div className="card">
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

      {/* ✅ AI CHATBOT */}
      <div className="card">
        <h2>🤖 AI Wellness Assistant</h2>

        <input
          type="text"
          placeholder="Ask me about detox, night usage, score..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button onClick={handleChat} style={{ marginLeft: "10px" }}>
          Ask
        </button>

        {chatReply && <p style={{ marginTop: "10px" }}>{chatReply}</p>}
      </div>
    </div>
  );
}

export default App;
