import React, { useMemo } from 'react';
import AuthContext from '../AuthContext';
import * as utils from '../utils';

import { Sheet, Table, Skeleton } from '@mui/joy';
import TicketRow from './TicketRow';

function TicketsList({ tickets, loading, onUpdate }) {
    const auth = React.useContext(AuthContext);

    const loadingRows = useMemo(
        () =>
            Array.from({ length: 10 }).map((_, indexO) => (
                <tr key={'ticket-skelecton-row-' + indexO}>
                    <td></td>
                    {Array.from({ length: 5 }).map((_, indexI) => (
                        <td key={`ticket-skelecton-row-${indexO}-${indexI}`}>
                            <Skeleton
                                variant="rectangular"
                                width={`${utils.randomWidth(70, 100)}%`}
                                height="1em"
                            />
                        </td>
                    ))}
                </tr>
            )),
        []
    );

    return (
        <Sheet sx={{ borderRadius: 10, padding: 2 }}>
            <Table size="lg">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }} />
                        <th style={{ width: '10%' }}>Status</th>
                        <th style={{ width: '15%' }}>Category</th>
                        <th style={{ width: '40%' }}>Title</th>
                        <th style={{ width: '15%' }}>Owner</th>
                        <th style={{ width: '15%' }}>Created at</th>
                        {auth.logged && auth.user.isAdmin && (
                            <th style={{ width: '15%' }}>Time estimate</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <TicketRow
                            key={ticket.id}
                            ticket={ticket}
                            onUpdate={onUpdate}
                        />
                    ))}
                    {loading &&
                        loadingRows.slice(
                            0,
                            tickets.length > 0 ? 5 : undefined
                        )}
                </tbody>
            </Table>
        </Sheet>
    );
}

export default TicketsList;
