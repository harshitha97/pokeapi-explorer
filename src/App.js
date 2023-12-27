import React, { useState, useEffect } from 'react';

function App() {
  const [poke, setPoke] = useState(null);
  const [curr, setCurr] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchpoke = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (Math.random() < 0.4) {
      console.log("Error");
      setPoke(new Error("Something went wrong. Try again"));
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

  const errorDialogStyle = {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '5px',
    padding: '20px',
    margin: '10px',
  };

  const errorTitleStyle = {
    color: '#721c24',
  };

  const errorMsgStyle = {
    color: 'red',
  };

  const tryAgainButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    marginBottom: '10px',
  };

  const handleTryAgainClick = () => {
    fetchpoke();
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: loading ? '#8b9992' : 'white',
        opacity: loading ? 0.5 : 1.0,
      }}
    >
      <h1>Pokedex</h1>
      {loading ? (
        <p>Loading table...</p>
      ) : poke instanceof Error ? (
        <div>
          <div style={errorDialogStyle}>
            <div>
              <h2 style={errorTitleStyle}>Error</h2>
              <p style={errorMsgStyle}>{poke.message}</p>
            </div>
          </div>
          <button
            onClick={handleTryAgainClick}
            style={tryAgainButtonStyle}
          >
            Try Again
          </button>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {poke.map((pokemon) => (
              <tr key={pokemon.name}>
                <td>{pokemon.name}</td>
                <td>{pokemon.url}</td>
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