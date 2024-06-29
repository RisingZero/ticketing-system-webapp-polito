import React, { useState } from 'react';
import AuthContext from '../AuthContext';
import * as utils from '../utils';
import { Chip, IconButton } from '@mui/joy';
import TicketDetails from './TicketDetails';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BlockIcon from '@mui/icons-material/Block';

function TicketRow({ ticket }) {
    const auth = React.useContext(AuthContext);

    const [open, setOpen] = useState(false);

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
            </tr>
            {auth.logged && open && (
                <tr style={{ height: 0, padding: 0 }}>
                    <td colSpan={6}>
                        <TicketDetails ticketId={ticket.id} />
                    </td>
                </tr>
            )}
        </>
    );
}

export default TicketRow;
