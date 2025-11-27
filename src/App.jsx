import { useEffect, useState } from "react";
import "./App.css";

function App() {
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
  const [chatReply, setChatReply] = useState("");
  const [listening, setListening] = useState(false);

  // ================= LOAD HISTORY =================
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("detoxHistory"));
    if (saved && saved.length) {
      setHistory(saved);
      setScore(calculateScore(saved));
    }
  }, []);

  // ================= SAVE HISTORY =================
  useEffect(() => {
    localStorage.setItem("detoxHistory", JSON.stringify(history));
  }, [history]);

  // ================= OBSERVE SCROLL =================
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

  // ================= SCORE LOGIC =================
  function calculateScore(list) {
    let s = 100;

    list.forEach((i) => {
      const t = Number(i.minutes);

      if (i.category === "Social") {
        if (t > 60 && t <= 120) s -= 10;
        else if (t > 120 && t <= 180) s -= 20;
        else if (t > 180) s -= 30;
      }

      if (i.category === "Entertainment") {
        if (t > 90 && t <= 150) s -= 10;
        else if (t > 150) s -= 20;
      }

      if (i.period === "Night") {
        if (t > 30 && t <= 60) s -= 10;
        else if (t > 60) s -= 20;
      }

      if ((i.category === "Study" || i.category === "Work") && t >= 60) {
        s += 5;
      }
    });

    return Math.max(0, Math.min(s, 100));
  }

  // ================= STATUS =================
  useEffect(() => {
    if (score >= 80) {
      setStatus("🟢 Healthy Digital Habits");
      setSuggestion("Your digital routine is balanced. Keep it up!");
    } else if (score >= 50) {
      setStatus("🟡 At Risk");
      setSuggestion("Reduce social & entertainment usage, especially at night.");
    } else {
      setStatus("🔴 Digital Addiction Risk");
      setSuggestion("Strong detox needed. Create phone-free hours.");
    }
  }, [score]);

  // ================= ADD USAGE =================
  function handleAdd() {
    if (!appName || !minutes) {
      alert("Enter app name and minutes");
      return;
    }

    const entry = {
      appName,
      category,
      minutes,
      period,
      date: new Date().toLocaleString(),
    };

    const updated = [entry, ...history];
    setHistory(updated);
    setScore(calculateScore(updated));

    setAppName("");
    setMinutes("");
  }

  function clearHistory() {
    if (window.confirm("Clear all history?")) {
      setHistory([]);
      setScore(100);
      localStorage.removeItem("detoxHistory");
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
    const msg = text.toLowerCase();
    let reply = "";

    if (msg.includes("score")) reply = `Your detox score is ${score}.`;
    else if (msg.includes("social"))
      reply = "Try to keep social media below 60 minutes daily.";
    else if (msg.includes("night"))
      reply = "Avoid screens 30 minutes before sleep.";
    else reply = "Ask about score, social media or night usage.";

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

  return (
    <div className={`app ${theme}`}>
      {/* ================= NAVBAR ================= */}
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

          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main id="home" className="main">
        <h1>Digital Habit Detox Analyzer</h1>

        <section className="card">
          <h3>Add App Usage</h3>
          <div className="form-grid">
            <input placeholder="App name" value={appName} onChange={(e) => setAppName(e.target.value)} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Social</option>
              <option>Entertainment</option>
              <option>Study</option>
              <option>Work</option>
            </select>
            <input type="number" placeholder="Minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>Day</option>
              <option>Night</option>
            </select>
            <button onClick={handleAdd}>Add</button>
          </div>
        </section>

        <section className="card">
          <h3>Detox Score</h3>
          <div className="score">{score} / 100</div>
            <div className="progress-wrap">
              <div
               className={`progress-bar ${
               score >= 80 ? "good" : score >= 50 ? "warn" : "bad"
              }`}
              style={{ width: `${score}%` }}
              />
            </div>


          <p>{status}</p>
          <p className="hint">{suggestion}</p>
          {history.length > 0 && <button onClick={clearHistory}>Clear History</button>}
        </section>

        <section id="history" className="card">
          <h3>Usage History</h3>
          {history.length === 0 ? (
            <p className="hint">No history yet</p>
          ) : (
            <ul>
              {history.map((h, i) => (
                <li key={i}>
                  <strong>{h.appName}</strong> • {h.category} • {h.minutes} min • {h.period}
                  <br />
                  <small>{h.date}</small>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="support" className="card">
          <h3>🤖 AI Voice Assistant</h3>
          <div className="chat">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={() => generateReply(chatInput)}>Ask</button>
            <button onClick={startListening}>
              {listening ? "Listening..." : "🎙 Voice"}
            </button>
          </div>
          {chatReply && <p className="chat-reply">{chatReply}</p>}
        </section>
      </main>

      <footer className="footer">© 2025 Digital Detox</footer>
    </div>
  );
}

export default App;
