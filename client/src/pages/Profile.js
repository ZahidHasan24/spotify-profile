import { useState, useEffect } from "react";
import { catchErrors } from "../utils/error";
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
} from "../service";
import { StyledHeader } from "../styles";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);

  useEffect(() => {
    catchErrors(fetchData());
  }, []);

  const fetchData = async () => {
    const userProfileRes = await getCurrentUserProfile();
    const userPlaylistsRes = await getCurrentUserPlaylists();
    const userTopArtistsRes = await getTopArtists();
    setProfile(userProfileRes.data);
    setPlaylists(userPlaylistsRes.data);
    setTopArtists(userTopArtistsRes.data);
  };

  return (
    <>
      {profile && (
        <StyledHeader type="user">
          <div className="header__inner">
            {profile.images.length && profile.images[0].url && (
              <img
                src={profile.images[0].url}
                alt="Avatar"
                className="header__img"
              />
            )}
            <div>
              <div className="header__overline">Profile</div>

              <h1 className="header__name">{profile.display_name}</h1>
              <p className="header__meta">
                {playlists && <span>{playlists.total} Playlists</span>}
                <span>{profile.followers.total} Followers</span>
              </p>
            </div>
          </div>
        </StyledHeader>
      )}
    </>
  );
};

export default Profile;
