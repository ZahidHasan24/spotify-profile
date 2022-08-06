import { useEffect, useState } from "react";
import { accessToken, logout } from "./utils/spotify";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8000/login">
            spotify login
          </a>
        ) : (
          <>
            <h1>Logged in!</h1>
            <button onClick={logout}>Log Out </button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
