import React, { useState, useEffect } from "react";
import Card from "./components/Card";
import "./App.css";

const fruitImages = [
  "bannana.jpeg",
  "mango.jpg",
  "apple.jpeg",
  "orange.jpeg",
  "pineapple.jpeg",
  "star.jpeg",
  "strawberry.jpeg",
  "kiwi.jpg",
  "watermelon.jpeg",
  "grapes.jpeg",
  "pear.jpeg",
  "papaya.jpeg",
  "guava.jpeg",
  "tamarind.jpeg",
  "amla.jpeg",
  "avocado.jpeg"
];

function shuffle(array) {
  return array
    .concat(array)
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [points, setPoints] = useState(0); // 1. Add points state

  useEffect(() => {
    setCards(shuffle(fruitImages));
    setFlipped([]);
    setMatched([]);
    setPoints(0); // Reset points on new game
  }, []);

  const handleCardClick = idx => {
    if (disabled || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setPoints(prev => prev + 5); // +5 for correct match
        setTimeout(() => {
          setFlipped([]);
          
          setDisabled(false);
        }, 1000);
      } else {
        setPoints(prev => prev - 1); // -1 for wrong match
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const handleReset = () => {
    setCards(shuffle(fruitImages));
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setPoints(0); // Reset points
  };

  return (
    <div className="game-container">
      <h1>Flip a Fruit</h1>
      <div className="points">Points: {points}</div>
      <div className="grid">
        {cards.map((fruit, idx) => (
          <Card
            key={idx}
            fruit={fruit}
            image={`/images/${fruit}`}
            flipped={flipped.includes(idx) || matched.includes(idx)}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </div>
      <footer className="footer">
        <button onClick={handleReset}>Reset</button>
      </footer>
    </div>
  );
}

export default App;
/****** */