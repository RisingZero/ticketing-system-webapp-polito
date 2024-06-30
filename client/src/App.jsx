import './App.css';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import React from 'react';
import { useAuth } from './hooks';
import AuthProvider from './components/Auth/AuthProvider';
import ToastProvider from './components/Toast/ToastProvider';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import API from './API';

import { Box, CircularProgress } from '@mui/joy';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import CreateTicketModal from './components/CreateTicketModal';
import LoginModal from './components/LoginModal';
import Logout from './components/Logout';

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <CssVarsProvider>
                        <CssBaseline />
                        <AppWithProviders />
                    </CssVarsProvider>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}

function AppWithProviders() {
    const [loading, setLoading] = React.useState(true);
    const auth = useAuth();

    React.useEffect(() => {
        setLoading(true);
        API.getProfile()
            .then((user) => {
                if (user) {
                    auth.setAuth({ logged: true, user });
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            {loading && (
                <Box
                    width="100dvw"
                    height="100dvh"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CircularProgress />
                </Box>
            )}
            {!loading && (
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />}>
                            {/* Nested routes for overlay modals on Home page */}
                            <Route
                                path="/create"
                                element={
                                    auth.logged ? (
                                        <CreateTicketModal />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route
                                path="/login"
                                element={
                                    !auth.logged ? (
                                        <LoginModal
                                            loginCallback={(user) =>
                                                auth.setAuth({
                                                    logged: true,
                                                    user,
                                                })
                                            }
                                        />
                                    ) : (
                                        <Navigate to="/" />
                                    )
                                }
                            />
                            <Route
                                path="/logout"
                                element={
                                    auth.logged ? (
                                        <Logout
                                            logoutCallback={() =>
                                                auth.setAuth({
                                                    logged: false,
                                                    user: null,
                                                })
                                            }
                                        />
                                    ) : (
                                        <Navigate to="/" />
                                    )
                                }
                            />
                        </Route>
                        <Route path="*" element={<NoMatch />}></Route>
                    </Routes>
                </Layout>
            )}
        </>
    );
}

export default App;
