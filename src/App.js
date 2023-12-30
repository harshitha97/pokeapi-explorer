import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useParams, Outlet } from 'react-router-dom';
// import { createContext, useContext } from 'react';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  const [curr, setCurr] = useState(1);

  function PokemonListPage() {
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    const fetchpoke = async () => {
      const offset = (curr - 1) * 10;
      const data = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`)
        .then((response) => response.json());
      return data.results;
    };

    const pokeQuery = useQuery(['pokemon', curr], fetchpoke, {
      retry: 1,
      refetchOnWindowFocus: false,
    });

    const nextPage = () => {
      setCurr(curr + 1);
    };

    const prevPage = () => {
      setCurr(curr - 1);
    };

    const handleRefetchClick = () => {
      pokeQuery.refetch();
    };

    const getUpdateTime = () => {
      if (pokeQuery.dataUpdatedAt !== null) {
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
        return formatter.format(pokeQuery.dataUpdatedAt);
      }
    };

    return (
      <div className="App">
        <h1 className='mb-4 pl-20 text-4xl italic text-start font-extrabold px-2 text-yellow-400'>Pokedex</h1>
        {pokeQuery.isLoading && <p>Loading table...</p>}
        {pokeQuery.isError && (
          <div>
            <h2>Error</h2>
            <p>{pokeQuery.error.message}</p>
          </div>
        )}
        {pokeQuery.isSuccess && (
          <table className='pl-3 ml-3 text-sm text-center text-gray-500 dark:text-gray-400 table-fixed'>
            <thead>
              <tr>
                <th scope='col' className='px-3 py-2 border border-slate-300'>Name</th>
                <th scope='col' className='px-3 py-2 border border-slate-300'>URL</th>
              </tr>
            </thead>
            <tbody>
              {pokeQuery.data.map((poke) => (
                <tr key={poke.name}>
                  <td>
                    <Link to={`/app/pokemon/${poke.name}`} onClick={() => setSelectedPokemon(poke)} className="text-blue-600 hover:text-blue-900 hover:underline hover:bg-green-100">
                      {poke.name}
                    </Link>
                  </td>
                  <td>{poke.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="buttons">
          <button onClick={prevPage} className="py-2 px-5 mx-5 my-2 rounded-lg border font-medium text-gray-700 focus:outline-none bg-green-50 border-gray-200 hover:bg-green-100 hover:text-blue-500 focus:z-10 focus:ring-40 focus:ring-gray-600">Previous</button>
          <button onClick={nextPage} className="py-2 px-9 mx-5 my-2 rounded-lg border font-medium text-gray-700 focus:outline-none bg-green-50 border-gray-200 hover:bg-green-100 hover:text-blue-500 focus:z-10 focus:ring-40 focus:ring-gray-600">Next</button>
        </div>
        <button onClick={handleRefetchClick} className="py-2 px-5 mx-20 my-2 rounded-lg bg-blue-500 text-white border-lime-600 border-4 ">Refetch</button>
        <p className='px-5'>Current Date and Time: {getUpdateTime()}</p>
      </div>
    );
  }

  function PokemonDetailsPage() {
    const { pokeName = 'non-valid' } = useParams();

    const fetchPokemonDetails = async () => {
      const pokeUrlData = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        .then((response) => response.json());

      const abilities = pokeUrlData.abilities.map(
        (ability) => ability.ability.name
      );

      const hpStat = pokeUrlData.stats.find((stat) => stat.stat.name === "hp");
      let pokeHpValue = undefined;
      if (hpStat) {
        pokeHpValue = hpStat.base_stat;
      }

      const pokeImage = pokeUrlData.sprites.front_shiny;

      const pokemonAllDetails = {
        name: pokeName,
        abilities: abilities,
        image: pokeImage,
        hp: pokeHpValue,
      };

      return pokemonAllDetails;
    };

    const queryKey = ['pokemon', pokeName];
    const { data, isLoading, isError } = useQuery(queryKey, fetchPokemonDetails);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (isError) {
      return <div>Error fetching data</div>;
    }

    const { name, image, hp, abilities } = data;

    const containerStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      width: '30%',
      backgroundColor: '#f2f2f2',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    const nameStyle = {
      fontSize: '24px',
      color: '#333',
    };

    const imageContainerStyle = {
      width: '30%',
      backgroundColor: '#D5F5E3',
      padding: '10px',
      borderRadius: '10px',
      marginBottom: '20px',
    };

    const imageStyle = {
      maxWidth: '500px',
      margin: '0',
      marginLeft: 'auto',
      marginRight: 'auto',
    };

    const abilitiesStyle = {
      marginTop: '20px',
    };

    const headingStyle = {
      fontSize: '18px',
      color: '#555',
    };

    const listItemStyle = {
      fontSize: '16px',
      color: '#777',
    };

    return (
      <div className="App" style={containerStyle}>
        <h1 style={nameStyle}>Hello {name}</h1>
        <div style={imageContainerStyle}>
          <img style={imageStyle} src={image} alt={name} />
        </div>
        <div style={abilitiesStyle}>
          <h2 style={headingStyle}>Abilities:</h2>
          <ul>
            {abilities.map((ability, index) => (
              <li key={index} style={listItemStyle}>{ability}</li>
            ))}
          </ul>
        </div>
        <div style={abilitiesStyle}>
          <h2 style={headingStyle}>HP: {hp}</h2>
        </div>
        <Link to="/app/">Back to Pokemon Page</Link>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/app/" element={<NavigationBar />}>
          <Route index element={<PokemonListPage />} />
          <Route path="pokemon/:pokeName" element={<PokemonDetailsPage />} />
        </Route>
      </Routes>
    </Router>
  );  
}

const NavigationBar = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/app/" className='px-5 text-lg block underline text-blue-500 hover:text-blue-900 hover:bg-green-50'>Pokedex</Link>
          </li>
        </ul>
      </nav>

      <Outlet />

      <nav>
        <ul>
          <li>
            <Link to="/app/" className='px-5 text-lg block underline text-blue-500 hover:text-blue-900 hover:bg-green-50'>Pokedex</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default App;