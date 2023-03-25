import { useState, useEffect } from "react";
import { catchErrors } from "../utils/error";
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
} from "../service";
import { StyledHeader } from "../styles";
import SectionWrapper from "../components/SectionWrapper";
import ArtistsGrid from "../components/ArtistsGrid";
import TrackList from "../components/TrackList";
import PlaylistsGrid from "../components/PlayListsGrid";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    catchErrors(fetchData());
  }, []);

  const fetchData = async () => {
    const userProfileRes = await getCurrentUserProfile();
    const userPlaylistsRes = await getCurrentUserPlaylists();
    const userTopArtistsRes = await getTopArtists();
    const userTopTracksRes = await getTopTracks();
    setProfile(userProfileRes.data);
    setPlaylists(userPlaylistsRes.data);
    setTopArtists(userTopArtistsRes.data);
    setTopTracks(userTopTracksRes.data);
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
      {topArtists && topTracks && playlists && (
        <main>
          <SectionWrapper title="Top Artists" seeAllLink="/top-artists">
            <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
          </SectionWrapper>
          <SectionWrapper title="Top Tracks" seeAllLink="/top-tracks">
            <TrackList tracks={topTracks.items.slice(0, 10)} />
          </SectionWrapper>
          <SectionWrapper title="Public Playlists" seeAllLink="/playlists">
            <PlaylistsGrid playlists={playlists.items.slice(0, 10)} />
          </SectionWrapper>
        </main>
      )}
    </>
  );
};

export default Profile;
