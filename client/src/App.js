import { useEffect, useState } from "react";
import { accessToken, logout } from "./utils/spotify";
import { getCurrentUserProfile } from "./service";
import { catchErrors } from "./utils/error";
import "./App.css";

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
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8000/login">
            spotify login
          </a>
        ) : (
          <>
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
          </>
        )}
      </header>
    </div>
  );
}

export default App;
