import { useState } from 'react';
import axios from 'axios';
import './App.css'; 

function DictionaryApp() {
  const [searchWord, setSearchWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDefinition = async () => {
    if (!searchWord) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
      );
      setDefinition(response.data[0]);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Word not found. Please try another word.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setDefinition(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDefinition();
  };

  return (
    <div className="main-container">
      <div className="search-side">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Enter a word..."
          />
          <button type="submit" disabled={loading}>
            Search
          </button>
        </form>
      </div>

      <div className="results-side">
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {definition && (
          <div className="definition-box">
            <h2>{definition.word}</h2>
            {definition.phonetics.map((p, index) => (
              <div key={index}>
                {p.text && <p className="phonetic-text">Phonetic: {p.text}</p>}
                {p.audio && (
                  <audio controls className="audio-player">
                    <source src={p.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
            {definition.meanings.map((meaning, index) => (
              <div key={index} className="meaning-section">
                <h3>{meaning.partOfSpeech}</h3>
                {meaning.definitions.map((def, defIndex) => (
                  <div key={defIndex} className="definition-item">
                    <p><strong>Definition:</strong> {def.definition}</p>
                    {def.example && (
                      <p className="example-text">
                        <em>Example:</em> "{def.example}"
                      </p>
                    )}
                    {def.synonyms.length > 0 && (
                      <p className="synonyms-text">
                        <strong>Synonyms:</strong> {def.synonyms.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DictionaryApp;