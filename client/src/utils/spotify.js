import { LOCALSTORAGE_KEYS, LOCALSTORAGE_VALUES } from "../localstorage";

const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const milliSecondsElapsed = Date.now() - Number(timestamp);
  return milliSecondsElapsed / 1000 > Number(expireTime);
};

const refreshToken = async () => {
  try {
    // Logout if there is no refresh token stored or we have managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error("No refresh token availabled");
      logout();
    }

    // use `/refresh_token` endpoint from server
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
    );

    // update localstorage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.accessToken
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    // reload the page for localsorage updated to be reflected
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };

  const hasError = urlParams.get("error");

  // If there's an error or the token in localstorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }

  // If there is a valid access token in localstorage, use that
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is a token in URL query params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localstorage
    for (const prop in queryParams) {
      window.localStorage.setItem(prop, queryParams[prop]);
    }

    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  // We should never get here
  return false;
};

export const accessToken = getAccessToken();
