import { useEffect, useState } from "react";
import SectionWrapper from "../components/SectionWrapper";
import { catchErrors } from "../utils/error";
import { getCurrentUserPlaylists } from "../service";
import PlaylistsGrid from "../components/PlayListsGrid";

const Playlists = () => {
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    catchErrors(fetchData());
  }, []);

  const fetchData = async () => {
    const userPlaylistsRes = await getCurrentUserPlaylists();
    setPlaylists(userPlaylistsRes.data);
  };

  return (
    <main>
      <SectionWrapper title="Playlists" breadcrumb={true}>
        {playlists && playlists.items && (
          <PlaylistsGrid playlists={playlists?.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default Playlists;
