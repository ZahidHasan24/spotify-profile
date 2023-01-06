import { useState, useEffect } from "react";
import { catchErrors } from "../utils/error";
import { getCurrentUserProfile } from "../service";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    catchErrors(fetchData());
  }, []);

  const fetchData = async () => {
    const res = await getCurrentUserProfile();
    setProfile(res.data);
  };

  return (
    <>
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
  );
};

export default Profile;
