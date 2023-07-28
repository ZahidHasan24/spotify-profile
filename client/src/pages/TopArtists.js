import { useEffect, useState } from "react";
import SectionWrapper from "../components/SectionWrapper";
import TimeRangeButtons from "../components/TimeRangeButtons";
import { catchErrors } from "../utils/error";
import ArtistsGrid from "../components/ArtistsGrid";
import { getTopArtists } from "../service";

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState("short");

  useEffect(() => {
    if (activeRange) {
      catchErrors(fetchData());
    }
  }, [activeRange]);

  const fetchData = async () => {
    const userTopArtistsRes = await getTopArtists(`${activeRange}_term`);
    setTopArtists(userTopArtistsRes.data);
  };

  return (
    <main>
      <SectionWrapper title="Top Artists" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />
        {topArtists && topArtists.items && (
          <ArtistsGrid artists={topArtists.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopArtists;
