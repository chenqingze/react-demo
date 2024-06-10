import axios from 'src/utils/axios';


// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken' as const;

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    setAccessToken(accessToken);

    axios.defaults.headers.common['X-Auth-Token'] = accessToken;

  } else {
    removeAccessToken();

    delete axios.defaults.headers.common.Authorization;
  }
};

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(STORAGE_KEY, accessToken);
};

export const getAccessToken = () => localStorage.getItem(STORAGE_KEY);

export const removeAccessToken = () => {
  localStorage.removeItem(STORAGE_KEY);
};
