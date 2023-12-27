import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [poke, setPoke] = useState([]);
  const [curr, setCurr] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const appRef = useRef(null);

  const fetchpoke = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (Math.random() < 0.4) {
      console.log("Error");
      setPoke([]); // Set to an empty array or another default value
      setLoading(false);
      return;
    }
    const offset = (curr - 1) * 10;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
    );
    const data = await response.json();
    setPoke(data.results);
    setLoading(false);
  };

  useEffect(() => {
    fetchpoke();
  }, [curr]);

  useEffect(() => {
    if (appRef.current) {
      const node = appRef.current;
      if (loading) {
        node.style.opacity = '0.5';
        node.style.animation = 'loading 1.5s infinite';
        node.style.transition = 'opacity 0.5s ease-in-out';
      } else {
        node.style.opacity = '1';
        node.style.animation = 'none';
        node.style.transition = 'none';
      }
      return () => {
        node.style.opacity = '0';
      };
    }
  }, [loading]);

  const nextPage = () => {
    setCurr(curr + 1);
  };

  const prevPage = () => {
    setCurr(curr - 1);
  };

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div className="App" style={{ background: loading ? 'yellow' : 'green' }}>
      <h1>Pokedex</h1>
      {loading ? (
        <p>Loading table...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {poke.map((poke) => (
              <tr key={poke.name}>
                <td>{poke.name}</td>
                <td>{poke.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="buttons">
        <button onClick={prevPage}>Previous</button>
        <button onClick={nextPage}>Next</button>
      </div>
      <div className="button">
        <h1>Counter increment and decrement</h1>
        <p>Count = {count}</p>
        <button onClick={increment}>increment</button>
        <button onClick={decrement}>decrement</button>
      </div>
    </div>
  );
}

export default App;
