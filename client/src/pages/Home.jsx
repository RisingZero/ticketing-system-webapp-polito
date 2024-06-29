import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { useToast } from '../hooks';
import { ToastSeverity } from '../components/Toast';
import API from '../API';

import { Stack, Box, Breadcrumbs, Button, Link, Typography } from '@mui/joy';
import TicketsList from '../components/TicketsList';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Add from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';

function Home() {
    const auth = React.useContext(AuthContext);
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);

    const fetchTickets = useCallback(() => {
        setLoading(true);
        API.getTickets()
            .then((data) => {
                setTickets(data);
            })
            .catch(() => {
                addToast('Failed to fetch tickets', {
                    severity: ToastSeverity.ERROR,
                });
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <Box>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
            >
                <Breadcrumbs
                    size="sm"
                    separator={<ChevronRightRoundedIcon fontSize="sm" />}
                    sx={{ pl: 2, pb: 2 }}
                >
                    <Link
                        to="/"
                        component={RouterLink}
                        underline="none"
                        color="neutral"
                        aria-label="Home"
                    >
                        <HomeRoundedIcon />
                    </Link>
                    <Typography color="primary" fontWeight={500} fontSize={12}>
                        Tickets
                    </Typography>
                </Breadcrumbs>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={2}
                    sx={{ mr: 2 }}
                >
                    {auth.logged && (
                        <Button
                            variant="solid"
                            color="primary"
                            component={RouterLink}
                            endDecorator={<Add />}
                            to="/create"
                        >
                            New Ticket
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        endDecorator={<CachedIcon />}
                        color="primary"
                        loading={loading}
                        onClick={fetchTickets}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>
            <TicketsList tickets={tickets} loading={loading} />

            <Outlet />
        </Box>
    );
}

export default Home;
