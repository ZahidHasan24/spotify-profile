import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { accessToken, logout } from "./utils/spotify";
import { getCurrentUserProfile } from "./service";
import { catchErrors } from "./utils/error";
import ScrollToTop from "./utils/ScrollToTop";
import { GlobalStyle } from "./styles";
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);
    catchErrors(fetchData());
  }, []);

  const fetchData = async () => {
    const res = await getCurrentUserProfile();
    setProfile(res.data);
  };

  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <>
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
                  <h1>Logged in!</h1>
                  <button onClick={logout}>Log Out </button>
                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>{profile.followers.total} followers</p>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Avatar" />
                      )}
                    </div>
                  )}
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
