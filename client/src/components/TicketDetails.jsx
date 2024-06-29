import React, { useState, useEffect } from 'react';
import API from '../API';

function TicketDetails({ ticketId }) {
    useEffect(() => {
        API.getTicketById(ticketId).then((data) => {
            console.log(data);
        });
    }, [ticketId]);

    return (
        <div>
            <h1>TicketDetails</h1>
        </div>
    );
}

export default TicketDetails;
