import React, { useState, useEffect } from 'react';
import { useAuth, useToast } from '../hooks';
import { ToastSeverity } from './Toast';
import API from '../API';

import {
    Sheet,
    Divider,
    Button,
    Chip,
    CircularProgress,
    Box,
    Stack,
    Typography,
    Select,
    Option,
} from '@mui/joy';
import TicketComments from './TicketComments';

function TicketDetails({ ticketId, ownerId, onUpdate }) {
    const { addToast } = useToast();
    const auth = useAuth();

    const [loading, setLoading] = useState(true);
    const [ticket, setTicket] = useState(null);

    const meAuthor = auth.user.id === ownerId;

    const fetchData = () => {
        setLoading(true);
        API.getTicketById(ticketId)
            .then((ticket) => {
                setTicket(ticket);
            })
            .catch((error) => {
                addToast(error, { severity: ToastSeverity.ERROR });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChangeCategory = (e, v) => {
        API.updateTicketCategory(ticketId, v)
            .then((res) => {
                setTicket(res.ticket);
                addToast(res.message, { severity: ToastSeverity.SUCCESS });
                if (onUpdate) onUpdate();
            })
            .catch((error) => {
                addToast(error, { severity: ToastSeverity.ERROR });
            });
    };

    const handleChangeStatus = () => {
        const newStatus = ticket.status === 'open' ? 'closed' : 'open';
        API.updateTicketStatus(ticketId, newStatus)
            .then((res) => {
                setTicket(res.ticket);
                addToast(res.message, { severity: ToastSeverity.SUCCESS });
                if (onUpdate) onUpdate();
            })
            .catch((error) => {
                addToast(error, { severity: ToastSeverity.ERROR });
            });
    };

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
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems={'flex-end'}
                            sx={{ pb: 1 }}
                        >
                            <Typography
                                color={
                                    ticket.status === 'open'
                                        ? 'success'
                                        : 'danger'
                                }
                            >
                                {ticket.status}
                            </Typography>
                            {auth.user.isAdmin ? (
                                <Select
                                    name="category"
                                    placeholder="Select a category"
                                    value={ticket.category}
                                    onChange={handleChangeCategory}
                                >
                                    {API.Ticket.CATEGORIES.map((category) => (
                                        <Option key={category} value={category}>
                                            {category}
                                        </Option>
                                    ))}
                                </Select>
                            ) : (
                                <Chip color="neutral" variant="outlined">
                                    {ticket.category}
                                </Chip>
                            )}
                        </Stack>
                        <Typography>
                            Created by <i>{ticket.ownerUsername}</i>
                        </Typography>
                        <Divider sx={{ my: 2, width: '80%' }} />
                        <Typography level="title-md">Description</Typography>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                            {ticket.description}
                        </Typography>
                        {(auth.user.isAdmin ||
                            (meAuthor && ticket?.status === 'open')) && (
                            <Button
                                color="danger"
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={handleChangeStatus}
                            >
                                {ticket?.status === 'open'
                                    ? 'Close ticket'
                                    : 'Reopen ticket'}
                            </Button>
                        )}
                    </Box>
                    <TicketComments
                        ticketId={ticketId}
                        ticketStatus={ticket.status}
                        meAuthor={meAuthor}
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
