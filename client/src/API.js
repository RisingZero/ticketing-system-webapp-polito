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

class APIError extends Error {
    constructor({ message, errors }) {
        super(message);
        this.name = this.constructor.name;
        this.errors = errors;
    }
}

const handleErrorResponseStatus = (response, data) => {
    if (!response.ok) {
        throw new APIError(data);
    }
};

const getProfile = async () => {
    const response = await fetch(`${SERVER_BASE}/users/me`, {
        credentials: 'include',
    });
    if (response.status === 401) {
        // Silent error, user is not logged in
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

    const data = await response.json();
    if (response.status === 401) {
        throw new APIError(data);
    }
    return data;
};

const logout = async () => {
    localStorage.removeItem('token');
    // Call logout on server to clear session
    try {
        await fetch(`${SERVER_BASE}/users/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {} // Ignore connection errors, user is logged out anyway
};

const getTickets = async () => {
    const response = await fetch(`${SERVER_BASE}/tickets`);
    const data = await response.json();
    handleErrorResponseStatus(response, data);
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

    const data = await response.json();
    if (response.status === 503) {
        if (!retry) throw new APIError(data);

        // auto-retry after 'Retry-After' seconds
        const retryAfter = response.headers.get('Retry-After');
        await delay(retryAfter);
        return createTicket(title, description, category, false);
    }
    handleErrorResponseStatus(response, data);

    return data;
};

const getTicketById = async (ticketId) => {
    const response = await fetch(`${SERVER_BASE}/tickets/${ticketId}`, {
        credentials: 'include',
    });

    const data = await response.json();
    handleErrorResponseStatus(response, data);

    return data;
};

const getComments = async (ticketId) => {
    const response = await fetch(
        `${SERVER_BASE}/tickets/${ticketId}/comments`,
        {
            credentials: 'include',
        }
    );

    const data = await response.json();
    handleErrorResponseStatus(response, data);

    return data;
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

    const data = await response.json();
    if (response.status === 503) {
        if (!retry) throw new APIError(data);

        // auto-retry after 'Retry-After' seconds
        const retryAfter = response.headers.get('Retry-After');
        await delay(retryAfter);
        return createComment(ticketId, content, false);
    }
    handleErrorResponseStatus(response, data);

    return data;
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

    const data = await response.json();
    if (response.status === 503) {
        if (!retry) throw new APIError(data);

        // auto-retry after 'Retry-After' seconds
        const retryAfter = response.headers.get('Retry-After');
        await delay(retryAfter);
        return updateTicketStatus(ticketId, status, false);
    }
    handleErrorResponseStatus(response, data);

    return data;
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

    const data = await response.json();
    if (response.status === 503) {
        if (!retry) throw new APIError(data);

        // auto-retry after 'Retry-After' seconds
        const retryAfter = response.headers.get('Retry-After');
        await delay(retryAfter);
        return updateTicketCategory(ticketId, category, false);
    }
    handleErrorResponseStatus(response, data);

    return data;
};

function HandleRequestJtwToken() {
    this.subscribers = [];
    this.request = null;

    return async (newToken = false) => {
        // Return token if already available and not requesting new token explicitly
        const token = localStorage.getItem('token');
        if (token && !newToken) {
            return token;
        }

        const promise = new Promise((resolve, reject) => {
            // Add caller to subscribers, to be notified when token is available
            this.subscribers.push({ resolve, reject });

            // Request token if not already in progress
            if (!this.request) {
                this.request = fetch(`${SERVER_BASE}/users/auth-token`, {
                    credentials: 'include',
                })
                    .then(async (response) => {
                        const data = await response.json();
                        if (response.status === 401) {
                            throw new APIError(data);
                        }
                        return data;
                    })
                    .then((data) => {
                        localStorage.setItem('token', data.token);

                        this.subscribers.forEach((subscriber) =>
                            subscriber.resolve(data.token)
                        );
                    })
                    .catch((error) => {
                        this.subscribers.forEach((subscriber) =>
                            subscriber.reject(error)
                        );
                    })
                    .finally(() => {
                        this.subscribers = [];
                        this.request = null;
                    });
            }
        });
        return promise;
    };
}

const requestJtwToken = new HandleRequestJtwToken();
const ticketTimeEstimate = async (title, category, requestToken = false) => {
    const response = await fetch(`${SERVER2_BASE}/ticket-estimate`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${await requestJtwToken(requestToken)}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, category }),
    });

    const data = await response.json();
    if (response.status === 401) {
        // Request token failed, throw error
        if (requestToken) throw new APIError(data);
        // Request new token and retry
        return ticketTimeEstimate(title, category, true);
    }

    return data;
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
    requestJtwToken,
    ticketTimeEstimate,
};
