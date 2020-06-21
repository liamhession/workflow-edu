// Used for handling authenticated access to site materials. After logging in, user info saved in localStorage
import {
  setLocalItem,
  getLocalItem,
} from '../utils/localStorage';

// isBrowser check done in getLocalItem
export const getUser = () => getLocalItem('gatsbyUser');

export const setUser = user => setLocalItem('gatsbyUser', user);