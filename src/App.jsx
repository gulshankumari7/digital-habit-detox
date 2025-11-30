import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AppRoutes from "./AppRoutes/AppRoutes";

// function App() {
//   return <AppRoutes />;
// }

// export default App;


// ----------------- HELPER: SCORE CALCULATION -----------------
function calculateScore(list) {
  let score = 100;

  let totalSocial = 0;
  let totalEntertainment = 0;
  let totalNight = 0;

  list.forEach((i) => {
    const t = Number(i.minutes);

    if (i.category === "Social") totalSocial += t;
    if (i.category === "Entertainment") totalEntertainment += t;
    if (i.period === "Night") totalNight += t;

    if ((i.category === "Study" || i.category === "Work") && t >= 60) {
      score += 5;
    }
  });

  // ✅ Social usage
  if (totalSocial > 60 && totalSocial <= 120) score -= 10;
  else if (totalSocial > 120 && totalSocial <= 180) score -= 20;
  else if (totalSocial > 180) score -= 30;

  // ✅ Entertainment
  if (totalEntertainment > 90 && totalEntertainment <= 150) score -= 10;
  else if (totalEntertainment > 150) score -= 20;

  // ✅ Night usage (MOST IMPORTANT FIX)
  if (totalNight > 30 && totalNight <= 60) score -= 10;
  else if (totalNight > 60 && totalNight <= 120) score -= 20;
  else if (totalNight > 120) score -= 30;

  return Math.max(0, Math.min(score, 100));
}



function App() {
  
  if (!localStorage.getItem("token")) {
  window.location.href = "/login";
}

  // ================= THEME =================
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ================= NAV =================
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // ================= USAGE =================
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState("Social");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("Day");

  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(100);

  // ================= STATUS =================
  const [status, setStatus] = useState("");
  const [suggestion, setSuggestion] = useState("");

  // ================= CHATBOT =================
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const [listening, setListening] = useState(false);

  const API_BASE = "http://localhost:5000";

  // ================= LOAD HISTORY FROM BACKEND =================
  useEffect(() => {
    async function fetchHistory() {
      try {
        const token = localStorage.getItem("token");

const res = await axios.get(`${API_BASE}/api/usage`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

        setHistory(res.data);
        setScore(calculateScore(res.data));
      } catch (err) {
        console.error("Error loading history:", err.message);
      }
    }

    fetchHistory();
  }, []); // only once on page load
function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

  // ================= OBSERVE SCROLL (ACTIVE NAV) =================
  useEffect(() => {
    const sections = ["home", "support", "history"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ================= STATUS TEXT =================
  useEffect(() => {
    if (score >= 80) {
      setStatus("🟢 Healthy Digital Habits");
      setSuggestion("Your digital routine is balanced. Keep it up!");
    } else if (score >= 50) {
      setStatus("🟡 At Risk");
      setSuggestion(
        "Reduce social & entertainment usage, especially at night."
      );
    } else {
      setStatus("🔴 Digital Addiction Risk");
      setSuggestion("Strong detox needed. Create phone-free hours.");
    }
  }, [score]);

  // ================= ADD USAGE (BACKEND + STATE) =================
  async function handleAdd() {
    if (!appName || !minutes) {
      alert("Enter app name and minutes");
      return;
    }

    try {
      const payload = {
        appName,
        category,
        minutes: Number(minutes),
        period,
      };

      // ➜ Save to backend
      const token = localStorage.getItem("token");

const res = await axios.post(
  `${API_BASE}/api/usage`,
  payload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const saved = res.data;

      // ➜ Update frontend state (newest on top)
      const updated = [saved, ...history];
      setHistory(updated);
      setScore(calculateScore(updated));

      // clear inputs
      setAppName("");
      setMinutes("");
    } catch (err) {
      console.error("Error saving usage:", err.message);
      alert("Failed to save usage. Check backend console.");
    }
  }

  async function clearHistory() {
  if (!window.confirm("Clear *all* usage history?")) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API_BASE}/api/usage`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setHistory([]);
    setScore(100);
    alert("History cleared ✅");
  } catch (err) {
    console.error("Delete error:", err.message);
    alert("Failed to clear history. Check backend console.");
  }
}


  // ================= CHATBOT =================
  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  }


function generateReply(text) {
  if (!text.trim()) return;

  const msg = text.toLowerCase();
  let reply = "";

  const totalNight = history
    .filter(h => h.period === "Night")
    .reduce((a,b)=>a+b.minutes,0);

  const totalSocial = history
    .filter(h => h.category === "Social")
    .reduce((a,b)=>a+b.minutes,0);

  if (msg.includes("score")) {
    reply = `Your detox score is ${score}/100.`;
  }

  else if (msg.includes("night")) {
    reply = totalNight > 60
      ? `Your night usage is ${totalNight} minutes. Try stopping screens 30 mins before bed.`
      : "Your night usage is healthy 👍";
  }

  else if (msg.includes("social")) {
    reply = totalSocial > 120
      ? `Social usage is ${totalSocial} minutes. Try limiting to 1 hour daily.`
      : "Your social usage looks fine 👍";
  }

  else if (msg.includes("hindi")) {
    reply = "Aapka digital usage moderate hai. Raat me phone kam use karna behtar hoga 👍";
  }

  else if (msg.includes("motivate")) {
    reply = "Small changes daily will make big improvements. You’re doing well 💪";
  }

  else {
    reply =
      "Ask me about your score, night usage, social media or say 'Hindi' 🙂";
  }

  setChatReply(reply);
  speak(reply);
}



  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Use Chrome for voice support.");

    const r = new SR();
    r.lang = "en-US";
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onresult = (e) => generateReply(e.results[0][0].transcript);
    r.start();
  }

  // ================= UI =================
  return (
    <div className={`app ${theme}`}>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-left">
          <h2>Digital Detox</h2>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a
            href="#home"
            className={activeSection === "home" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#support"
            className={activeSection === "support" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Support
          </a>
          <a
            href="#history"
            className={activeSection === "history" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            History
          </a>
        </nav>

       <div className="nav-right">
  <button className="theme-btn" onClick={toggleTheme}>
    {theme === "dark" ? "🌙 Dark" : "☀ Light"}
  </button>

  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>

  <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
    ☰
  </div>
</div>

      </header>

      {/* MAIN */}
      <main id="home" className="main">
        <h1>Digital Habit Detox Analyzer</h1>

        {/* Add Usage */}
        <section className="card">
          <h3>Add App Usage</h3>
          <div className="form-grid">
            <input
              placeholder="App name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Social</option>
              <option>Entertainment</option>
              <option>Study</option>
              <option>Work</option>
            </select>
            <input
              type="number"
              placeholder="Minutes"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>Day</option>
              <option>Night</option>
            </select>
            <button className="add-btn" onClick={handleAdd}>
  Add
</button>

          </div>
        </section>

        {/* Detox Score */}
        <section className="card">
          <h3>Detox Score</h3>
          <div className="score-display">{score} / 100</div>

<div className="progress-wrap">
  <div
    className={`progress-bar ${
      score >= 80 ? "good" : score >= 50 ? "warn" : "bad"
    }`}
    style={{ width: `${score}%` }}
  ></div>
</div>

<p className="status-text">{status}</p>
<p className="hint-text">{suggestion}</p>

          {history.length > 0 && (
  <button className="clear-btn" onClick={clearHistory}>
    🗑 Clear History
  </button>
)}

        </section>

        {/* Usage History */}
        <section id="history" className="card">
          <h3>Usage History</h3>
          {history.length === 0 ? (
            <p className="hint-text">No history yet</p>
          ) : (
            <ul className="usage-list">
              {history.map((h) => (
                <li key={h._id}>
                  <strong>{h.appName}</strong> • {h.category} • {h.minutes} min •{" "}
                  {h.period}
                  <br />
                  <small>
                    {new Date(h.createdAt).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* AI Assistant */}
        <section id="support" className="card">
          <h3>🤖 AI Voice Assistant</h3>
          <div className="chat-row">
            <input
  value={chatInput}
  onChange={(e) => setChatInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") generateReply(chatInput);
  }}
  placeholder="Ask about your digital habits..."
/>


            <button onClick={() => generateReply(chatInput)}>Ask</button>
            <button
  className={`voice-btn ${listening ? "listening" : ""}`}
  onClick={startListening}
>
  <span className="mic">🎙</span>
  <span>{listening ? "Listening" : "Voice"}</span>
  {listening && <span className="wave"></span>}
</button>

          </div>
          <div className="chat-box">
  {chatMessages.map((m, i) => (
    <div
      key={i}
      className={`chat-bubble ${m.type === "user" ? "user" : "bot"}`}
    >
      {m.text}
    </div>
  ))}
</div>


          <ul className="support-list">
  <li onClick={() => generateReply("score")}>
    📊 What is my detox score?
  </li>

  <li onClick={() => generateReply("night usage")}>
    🌙 Analyze my night usage
  </li>

  <li onClick={() => generateReply("social media")}>
    📱 How is my social media usage?
  </li>

  <li onClick={() => generateReply("hindi")}>
    🇮🇳 Batao Hindi mein
  </li>

  <li onClick={() => generateReply("motivate me")}>
    💪 Motivate me
  </li>
</ul>

        </section>
      </main>

      <footer className="footer">© 2025 Digital Detox</footer>
    </div>
  );
}

export default App;
