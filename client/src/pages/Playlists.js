import { useEffect, useState } from "react";
import SectionWrapper from "../components/SectionWrapper";
import { catchErrors } from "../utils/error";
import { getCurrentUserPlaylists } from "../service";
import PlaylistsGrid from "../components/PlayListsGrid";
import axios from "axios";

const Playlists = () => {
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  const fetchData = async () => {
    const userPlaylistsRes = await getCurrentUserPlaylists();
    setPlaylistsData(userPlaylistsRes.data);
  };

  const fetchMoreData = async (nextUrl) => {
    if (nextUrl) {
      const { data } = await axios.get(nextUrl);
      setPlaylistsData((prevData) => ({
        ...prevData,
        items: [...prevData.items, ...data.items],
        next: data.next,
      }));
    }
  };

  useEffect(() => {
    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    if (!playlistsData) {
      return;
    }

    // Update playlists when playlistsData changes
    setPlaylists(playlistsData.items);

    // Fetch more data when playlistsData.next is available
    catchErrors(fetchMoreData(playlistsData.next));
  }, [playlistsData]);

  return (
    <main>
      <SectionWrapper title="Public Playlists" breadcrumb={true}>
        {playlists && <PlaylistsGrid playlists={playlists} />}
      </SectionWrapper>
    </main>
  );
};

export default Playlists;
