import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { accessToken, logout } from "./utils/spotify";
import { GlobalStyle, StyledLogoutButton } from "./styles";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import TopArtists from "./pages/TopArtists";

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
            <StyledLogoutButton onClick={logout}>Logout</StyledLogoutButton>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Profile />} />
                <Route path="/top-artists" element={<TopArtists />} />
              </Routes>
            </BrowserRouter>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
