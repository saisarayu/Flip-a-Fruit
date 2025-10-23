import React, { useState, useEffect } from "react";
import Card from "./components/Card";
import "./App.css";

const fruitImages = [
  "bannana.jpeg","mango.jpg","apple.jpeg","orange.jpeg","pineapple.jpeg","star.jpeg",
  "strawberry.jpeg","kiwi.jpg","watermelon.jpeg","grapes.jpeg","pear.jpeg","papaya.jpeg",
  "guava.jpeg","tamarind.jpeg","amla.jpeg","avocado.jpeg"
];

function shuffle(array) {
  return array
    .concat(array)
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const GAME_SECONDS = 300;

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [points, setPoints] = useState(0);
  const [pulse, setPulse] = useState(false);

  // effects
  const [flashMatch, setFlashMatch] = useState([]);
  const [flashMiss, setFlashMiss] = useState([]);
  const [won, setWon] = useState(false);

  // timer
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [ticking, setTicking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null); // 'win' | 'lose' | null

  // Score pulse
  useEffect(() => {
    if (!Number.isFinite(points)) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [points]);

  // Initial deal
  useEffect(() => {
    setCards(shuffle(fruitImages));
    setFlipped([]);
    setMatched([]);
    setPoints(0);
    setDisabled(false);
    setTimeLeft(GAME_SECONDS);
    setTicking(false);
    setGameOver(false);
    setResult(null);
  }, []);

  // Countdown
  useEffect(() => {
    if (!ticking || gameOver) return;
    if (timeLeft <= 0) {
      setTicking(false);
      setGameOver(true);
      setResult(matched.length === cards.length && cards.length > 0 ? "win" : "lose");
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [ticking, timeLeft, gameOver, matched.length, cards.length]);

  // Win early if all cards matched before time runs out
  useEffect(() => {
    if (cards.length && matched.length === cards.length && !gameOver && timeLeft > 0) {
      setResult("win");
      setGameOver(true);
      setTicking(false);
      setWon(true);
      setTimeout(() => setWon(false), 900);
    }
  }, [matched, cards.length, timeLeft, gameOver]);

  const handleCardClick = (idx) => {
    if (gameOver) return;
    if (!ticking) setTicking(true); // start timer on first click
    if (disabled || flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;

      if (cards[first] === cards[second]) {
        setMatched(prev => [...prev, first, second]);
        setPoints(p => p + 5);
        setFlashMatch([first, second]);

        setTimeout(() => {
          setFlipped([]);
          setFlashMatch([]);
          setDisabled(false);
        }, 600);
      } else {
        setPoints(p => p - 1);
        setFlashMiss([first, second]);

        setTimeout(() => {
          setFlipped([]);
          setFlashMiss([]);
          setDisabled(false);
        }, 900);
      }
    }
  };

  const handleReset = () => {
    setDisabled(true);
    setFlipped([]);
    setMatched([]);
    setPoints(0);
    setFlashMatch([]);
    setFlashMiss([]);
    setWon(false);
    setGameOver(false);
    setResult(null);
    setTimeLeft(GAME_SECONDS);
    setTicking(false);

    setTimeout(() => {
      setCards(shuffle(fruitImages));
      setDisabled(false);
    }, 120);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="game-container">
      <div className={`board ${won ? "win" : ""}`}>
        <div className="topbar">
          <h1 className="title">Flip a Fruit</h1>
          <div className="badges">
            <div className={`timer-badge ${timeLeft <= 10 ? "danger" : ""}`}>
              {formatTime(timeLeft)}
            </div>
            <div className={`points-badge ${pulse ? "bump" : ""}`}>Points: {points}</div>
          </div>
        </div>

        <div className="grid">
          {cards.map((fruit, idx) => (
            <Card
              key={idx}
              image={`/images/${fruit}`}
              flipped={flipped.includes(idx) || matched.includes(idx)}
              matched={matched.includes(idx)}
              miss={flashMiss.includes(idx)}
              onClick={() => handleCardClick(idx)}
            />
          ))}
        </div>
      </div>

      <footer className="footer">
        <button className="btn" type="button" onClick={handleReset}>Reset</button>
      </footer>

      {gameOver && (
        <div className={`overlay ${result}`}>
          <div className="modal">
            <h2>{result === "win" ? "You Win! 🎉" : "Time’s Up ⏰"}</h2>
            <p>Points: <strong>{points}</strong></p>
            <button className="btn" onClick={handleReset}>
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
/*** */