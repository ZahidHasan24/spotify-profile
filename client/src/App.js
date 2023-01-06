import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { accessToken, logout } from "./utils/spotify";
import ScrollToTop from "./utils/ScrollToTop";
import { GlobalStyle } from "./styles";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <>
            <button onClick={logout}>Logout</button>
            <Router>
              <ScrollToTop />
              <Switch>
                <Route path="/top-artists">
                  <h1>Top Artists</h1>
                </Route>
                <Route path="/top-tracks">
                  <h1>Top Tracks</h1>
                </Route>
                <Route path="/playlists/:id">
                  <h1>Playlist</h1>
                </Route>
                <Route path="/playlists">
                  <h1>Playlists</h1>
                </Route>
                <Route path="/">
                  <Profile />
                </Route>
              </Switch>
            </Router>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
