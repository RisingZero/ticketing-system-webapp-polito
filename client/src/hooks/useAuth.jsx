import React from 'react';
import { AuthContext } from '../components/Auth/AuthProvider';

export function useAuth() {
    const authHelpers = React.useContext(AuthContext);
    return authHelpers;
}
