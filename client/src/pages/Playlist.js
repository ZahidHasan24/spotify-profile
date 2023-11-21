import { useEffect, useState, useMemo } from "react";
import SectionWrapper from "../components/SectionWrapper";
import { catchErrors } from "../utils/error";
import { getAudioFeaturesForTracks, getPlaylistById } from "../service";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StyledHeader, StyledDropdown } from "../styles";
import TrackList from "../components/TrackList";

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [sortValue, setSortValue] = useState("");
  const sortOptions = ["danceability", "tempo", "energy"];

  const fetchData = async () => {
    const userPlaylistRes = await getPlaylistById(id);
    setPlaylist(userPlaylistRes.data);
    setTracksData(userPlaylistRes.data.tracks);
  };

  useEffect(() => {
    catchErrors(fetchData());
  }, [id]);

  const fetchMoreData = async () => {
    if (tracksData.next) {
      const { data } = await axios.get(tracksData.next);
      setTracksData(data);
    }
  };

  const fetchAudioFeatures = async () => {
    const ids = tracksData.items.map(({ track }) => track.id).join(",");
    const { data } = await getAudioFeaturesForTracks(ids);
    setAudioFeatures((audioFeatures) => [
      ...(audioFeatures ? audioFeatures : []),
      ...data["audio_features"],
    ]);
  };

  useEffect(() => {
    if (!tracksData) {
      return;
    }
    setTracks((tracks) => [...(tracks ? tracks : []), ...tracksData.items]);
    catchErrors(fetchMoreData());
    catchErrors(fetchAudioFeatures());
  }, [tracksData]);

  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures) {
      return null;
    }

    return tracks.map(({ track }) => {
      const trackToAdd = track;

      if (!track.audio_features) {
        const audioFeaturesObj = audioFeatures.find((item) => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        });

        trackToAdd["audio_features"] = audioFeaturesObj;
      }

      return trackToAdd;
    });
  }, [tracks, audioFeatures]);

  const sortedTracks = useMemo(() => {
    if (!tracksWithAudioFeatures) {
      return null;
    }

    return [...tracksWithAudioFeatures].sort((a, b) => {
      const aFeatures = a["audio_features"];
      const bFeatures = b["audio_features"];

      if (!aFeatures || !bFeatures) {
        return false;
      }

      return bFeatures[sortValue] - aFeatures[sortValue];
    });
  }, [sortValue, tracksWithAudioFeatures]);

  return (
    <>
      {playlist && (
        <>
          <StyledHeader>
            <div className="header__inner">
              {playlist.images.length && playlist.images[0].url && (
                <img
                  className="header__img"
                  src={playlist.images[0].url}
                  alt="Playlist Artwork"
                />
              )}
              <div>
                <div className="header__overline">Playlist</div>
                <h1 className="header__name">{playlist.name}</h1>
                <p className="header__meta">
                  {playlist.followers.total ? (
                    <span>
                      {playlist.followers.total}{" "}
                      {`follower${playlist.followers.total !== 1 ? "s" : ""}`}
                    </span>
                  ) : null}
                  <span>
                    {playlist.tracks.total}{" "}
                    {`song${playlist.tracks.total !== 1 ? "s" : ""}`}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>

          <main>
            <SectionWrapper title="Playlist" breadcrumb={true}>
              <StyledDropdown active={!!sortValue}>
                <label className="sr-only" htmlFor="order-select">
                  Sort tracks
                </label>
                <select
                  name="track-order"
                  id="order-select"
                  onChange={(e) => setSortValue(e.target.value)}
                >
                  <option value="">Sort tracks</option>
                  {sortOptions.map((option, i) => (
                    <option value={option} key={i}>
                      {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                    </option>
                  ))}
                </select>
              </StyledDropdown>

              {sortedTracks && <TrackList tracks={sortedTracks} />}
            </SectionWrapper>
          </main>
        </>
      )}
    </>
  );
};

export default Playlist;
