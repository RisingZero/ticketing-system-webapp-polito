import { delay } from './utils';

const SERVER_HOST = 'http://localhost';
const SERVER_PORT = 3001;
const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api`;

const SERVER2_HOST = 'http://localhost';
const SERVER2_PORT = 3002;
const SERVER2_BASE = `${SERVER2_HOST}:${SERVER2_PORT}/api`;

const Ticket = {
    CATEGORIES: [
        'administrative',
        'inquiry',
        'maintenance',
        'new feature',
        'payment',
    ],
    STATUS: ['open', 'closed'],
};

const handleErrorResponseStatus = (response) => {
    if (response.status === 401) {
        throw new Error('Not authorized, please login first.');
    }
    if (response.status === 403) {
        throw new Error(
            'Forbidden, you are not allowed to perform this action.'
        );
    }
    if (response.status === 404) {
        throw new Error('Ticket not found.');
    }
    if (response.status === 500) {
        throw new Error('Internal server error.');
    }
    if (response.status === 422) {
        throw new Error('Invalid input, please check your data.');
    }
};

const getProfile = async () => {
    const response = await fetch(`${SERVER_BASE}/users/me`, {
        credentials: 'include',
    });
    if (response.status === 401) {
        return null;
    }
    return await response.json();
};

const login = async (username, password) => {
    const response = await fetch(`${SERVER_BASE}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    });
    if (response.status === 401) {
        return null;
    }
    return await response.json();
};

const logout = async () => {
    return await fetch(`${SERVER_BASE}/users/logout`, {
        method: 'POST',
        credentials: 'include',
    });
};

const getTickets = async () => {
    const response = await fetch(`${SERVER_BASE}/tickets`);
    const data = await response.json();
    return data;
};

const createTicket = async (title, description, category, retry = true) => {
    const response = await fetch(`${SERVER_BASE}/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, category }),
        credentials: 'include',
    });

    handleErrorResponseStatus(response);

    if (response.status === 503) {
        if (!retry)
            throw new Error('Service unavailable, please try again later.');

        // auto-retry after 'Retry-After' seconds
        const retryAfter = response.headers.get('Retry-After');
        await delay(retryAfter);
        return createTicket(title, description, category, false);
    }

    return await response.json();
};

const getTicketById = async (ticketId) => {
    const response = await fetch(`${SERVER_BASE}/tickets/${ticketId}`, {
        credentials: 'include',
    });

    handleErrorResponseStatus(response);

    return await response.json();
};

const getComments = async (ticketId) => {
    const response = await fetch(
        `${SERVER_BASE}/tickets/${ticketId}/comments`,
        {
            credentials: 'include',
        }
    );

    handleErrorResponseStatus(response);

    return await response.json();
};

const createComment = async (ticketId, content, retry = true) => {
    const response = await fetch(
        `${SERVER_BASE}/tickets/${ticketId}/comments`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
            credentials: 'include',
        }
    );

    handleErrorResponseStatus(response);

    if (response.status === 503) {
        if (!retry)
            throw new Error('Service unavailable, please try again later.');

        // auto-retry after 'Retry-After' seconds
        const retryAfter = response.headers.get('Retry-After');
        await delay(retryAfter);
        return createComment(ticketId, content, false);
    }

    if (response.status === 409) {
        throw new Error('Ticket is closed, no more comments allowed.');
    }

    return await response.json();
};

const updateTicketStatus = async (ticketId, status, retry = true) => {
    const response = await fetch(`${SERVER_BASE}/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: status }),
        credentials: 'include',
    });

    handleErrorResponseStatus(response);

    if (response.status === 503) {
        if (!retry)
            throw new Error('Service unavailable, please try again later.');

        // auto-retry after 'Retry-After' seconds
        const retryAfter = response.headers.get('Retry-After');
        await delay(retryAfter);
        return updateTicketStatus(ticketId, status, false);
    }

    return await response.json();
};

const updateTicketCategory = async (ticketId, category, retry = true) => {
    const response = await fetch(
        `${SERVER_BASE}/tickets/${ticketId}/category`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: category }),
            credentials: 'include',
        }
    );

    handleErrorResponseStatus(response);

    if (response.status === 503) {
        if (!retry)
            throw new Error('Service unavailable, please try again later.');

        // auto-retry after 'Retry-After' seconds
        const retryAfter = response.headers.get('Retry-After');
        await delay(retryAfter);
        return updateTicketCategory(ticketId, category, false);
    }

    return await response.json();
};

export default {
    Ticket,
    getProfile,
    login,
    logout,
    getTickets,
    createTicket,
    getTicketById,
    getComments,
    createComment,
    updateTicketStatus,
    updateTicketCategory,
};
