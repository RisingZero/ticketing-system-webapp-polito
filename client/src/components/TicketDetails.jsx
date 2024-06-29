import React, { useState, useEffect } from 'react';
import { ToastSeverity } from './Toast';
import { useToast } from '../hooks';
import API from '../API';

import {
    Sheet,
    Divider,
    Chip,
    CircularProgress,
    Box,
    Stack,
    Typography,
} from '@mui/joy';
import TicketComments from './TicketComments';

function TicketDetails({ ticketId }) {
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [ticket, setTicket] = useState(null);

    const fetchData = () => {
        setLoading(true);
        API.getTicketById(ticketId)
            .then((ticket) => {
                setTicket(ticket);
            })
            .catch((error) => {
                addToast(error.message, ToastSeverity.ERROR);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Sheet
            sx={{
                py: 2,
            }}
        >
            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {!loading && (
                <Stack direction="row" spacing={2}>
                    <Box
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Typography level="h3" sx={{ mb: 2 }}>
                            {ticket.title}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Typography
                                color={
                                    ticket.status === 'open'
                                        ? 'success'
                                        : 'danger'
                                }
                            >
                                {ticket.status}
                            </Typography>
                            <Chip color="neutral" variant="outlined">
                                {ticket.category}
                            </Chip>
                        </Stack>
                        <Typography>
                            Created by <i>{ticket.ownerUsername}</i>
                        </Typography>
                        <Divider sx={{ my: 2, width: '80%' }} />
                        <Typography level="title-md">Description</Typography>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                            {ticket.description}
                        </Typography>
                    </Box>
                    <TicketComments
                        ticketId={ticketId}
                        ticketStatus={ticket.status}
                        sx={{
                            width: '100%',
                        }}
                    />
                </Stack>
            )}
        </Sheet>
    );
}

export default TicketDetails;
