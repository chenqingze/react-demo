import { createContext } from 'react';

import { SessionContextType } from '../../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as SessionContextType);
