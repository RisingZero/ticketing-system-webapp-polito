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

const getTicketById = async (ticketId) => {
    const response = await fetch(`${SERVER_BASE}/tickets/${ticketId}`, {
        credentials: 'include',
    });
    const data = await response.json();
    return data;
};

export default {
    Ticket,
    getProfile,
    login,
    logout,
    getTickets,
    getTicketById,
};
