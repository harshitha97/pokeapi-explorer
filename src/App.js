import React, { useState, useEffect, createContext, useContext } from 'react';

function App() {
  const [poke, setPoke] = useState(null);
  const [curr, setCurr] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const fetchpoke = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (Math.random() < 0.4) {
      console.log("Error");
      setPoke(new Error("Something went wrong. Try again."));
      setLastUpdateTime(new Date());
      setLoading(false);
      return;
    }
    const offset = (curr - 1) * 10;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
    );
    const data = await response.json();
    setPoke(data.results);
    setLastUpdateTime(new Date());
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
    padding: '10px',
    margin: '10px 0',
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
    padding: '10px 10px',
    borderRadius: '5px',
    marginBottom: '10px',
  };

  const reftchButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 10px',
    borderRadius: '5px',
    marginBottom: '10px',
    marginTop: '10px',
  };

  const handleTryAgainClick = () => {
    fetchpoke();
  };

  const handleRefetchClick = () => {
    fetchpoke();
    setLastUpdateTime(new Date());
  };

  const getUpdateTime = () => {
    if (lastUpdateTime !== null) {
      const dt = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat(undefined, dt);
      return formatter.format(lastUpdateTime);
    }
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: loading ? '#8b9992' : 'white',
        opacity: loading ? 0.5 : 1.0,
        animation: loading ? 'loading 1.5s infinite' : 'none',
        transition: loading ? 'opacity 0.5s ease-in-out' : 'none',
      }}
    >
      <GrandchildContext.Provider value={'Name for grandchild only'}>
        <NestedChild name="Harshitha" />
      </GrandchildContext.Provider>
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
      <button onClick={handleRefetchClick} style={reftchButtonStyle}>
        Refetch
      </button>
      <p>Current Date and Time: {getUpdateTime()}</p>
    </div>
  );
}

export const GrandchildContext = createContext(null);

function NestedChild(props) {
  return (
    <div>
      Hello, World {props.name}
      <NestedGrandChild />
    </div>
  );
}

function NestedGrandChild() {
  const grandchildName = useContext(GrandchildContext);
  return <div>Hello, GrandChild {grandchildName}</div>;
}

export default App;
