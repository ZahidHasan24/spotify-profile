import { useEffect, useState } from "react";
import SectionWrapper from "../components/SectionWrapper";
import TimeRangeButtons from "../components/TimeRangeButtons";
import { catchErrors } from "../utils/error";
import { getTopTracks } from "../service";
import TrackList from "../components/TrackList";

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState("short");

  useEffect(() => {
    if (activeRange) {
      catchErrors(fetchData());
    }
  }, [activeRange]);

  const fetchData = async () => {
    const userTopTracksRes = await getTopTracks(`${activeRange}_term`);
    setTopTracks(userTopTracksRes.data);
  };

  return (
    <main>
      <SectionWrapper title="Top Tracks" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />
        {topTracks && topTracks.items && <TrackList tracks={topTracks.items} />}
      </SectionWrapper>
    </main>
  );
};

export default TopTracks;
