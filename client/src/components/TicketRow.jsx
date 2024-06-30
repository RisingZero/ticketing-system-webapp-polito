import React, { useState } from 'react';
import { useAuth } from '../hooks';
import API from '../API';
import * as utils from '../utils';

import { Chip, IconButton, Skeleton, Typography } from '@mui/joy';
import TicketDetails from './TicketDetails';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BlockIcon from '@mui/icons-material/Block';

function TicketRow({ ticket, onUpdate }) {
    const auth = useAuth();

    const [open, setOpen] = useState(false);
    const [timeEstimate, setTimeEstimate] = useState(null);
    const [loadingEstimate, setLoadingEstimate] = useState(true);

    React.useEffect(() => {
        if (auth.logged && auth.user.isAdmin) {
            setLoadingEstimate(true);
            API.ticketTimeEstimate(ticket.title, ticket.category)
                .then((data) => {
                    setTimeEstimate(`${data.estimate} ${data.unit}`);
                })
                .catch((error) => {
                    console.log(error);
                    setTimeEstimate('N/A');
                })
                .finally(() => {
                    setLoadingEstimate(false);
                });
        }
    }, [ticket.title, ticket.category, auth.logged]);

    return (
        <>
            <tr>
                <td>
                    {auth.logged && (
                        <IconButton
                            variant="plain"
                            size="sm"
                            color="neutral"
                            aria-label="expand ticket"
                            onClick={() => setOpen((x) => !x)}
                        >
                            {open ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>
                    )}
                </td>
                <td>
                    <Chip
                        color={ticket.status === 'open' ? 'success' : 'danger'}
                        variant="solid"
                        startDecorator={
                            ticket.status === 'open' ? (
                                <CheckCircleOutlineIcon />
                            ) : (
                                <BlockIcon />
                            )
                        }
                    >
                        {ticket.status}
                    </Chip>
                </td>
                <td>
                    <Chip color="neutral" variant="outlined">
                        {ticket.category}
                    </Chip>
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.ownerUsername}</td>
                <td>{utils.formatDateFromEpoch(ticket.createdAt)}</td>
                {auth.logged && auth.user.isAdmin && (
                    <td>
                        <Typography>
                            <Skeleton loading={loadingEstimate}>
                                {timeEstimate}
                            </Skeleton>
                        </Typography>
                    </td>
                )}
            </tr>
            {auth.logged && open && (
                <tr style={{ height: 0, padding: 0 }}>
                    <td colSpan={6}>
                        <TicketDetails
                            ticketId={ticket.id}
                            ownerId={ticket.ownerId}
                            onUpdate={onUpdate}
                        />
                    </td>
                </tr>
            )}
        </>
    );
}

export default TicketRow;
