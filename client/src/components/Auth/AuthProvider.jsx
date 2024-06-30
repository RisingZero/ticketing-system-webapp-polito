import React from 'react';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const [logged, setLogged] = React.useState(false);
    const [user, setUser] = React.useState(null);

    const setAuth = React.useCallback(({ logged, user }) => {
        setLogged(logged);
        setUser(user);
    }, []);

    return (
        <AuthContext.Provider value={{ user, logged, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export { AuthContext };
