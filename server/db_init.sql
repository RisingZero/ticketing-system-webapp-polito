-- Drop the users table if it exists
DROP TABLE IF EXISTS users;

-- Drop the tickets table if it exists
DROP TABLE IF EXISTS tickets;

-- Drop the comments table if it exists
DROP TABLE IF EXISTS comments;

-- Create the users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER NOT NULL
);

-- Create the tickets table
CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER,
    created_at INTEGER NOT NULL,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create the comments table
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER,
    author_id INTEGER,
    posted_at INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Insert some initial data into the users table
INSERT INTO users (username, password, is_admin) VALUES
    ('admin1', 'admin1', 1),
    ('admin2', 'admin2', 1),
    ('user1', 'user1', 0),
    ('user2', 'user2', 0),
    ('user3', 'user3', 0);

-- Insert some initial data into the tickets table
INSERT INTO tickets (owner_id, created_at, status, category, title, description) VALUES
    (3, unixepoch('2024-01-10T14:45:00'), 'open', 'inquiry', 'Bug 1', 'This is a bug report.'),
    (4, unixepoch('2024-03-01T12:01:10'), 'open', 'maintenance', 'Feature 1', 'This is a feature request.'),
    (5, unixepoch('2024-03-21T17:00:50'), 'closed', 'new feature', 'Bug 2', 'This is another bug report.'),
    (3, unixepoch('2024-05-01T12:00:00'), 'closed', 'administrative', 'Feature 2', 'This is another feature request.'),
    (4, unixepoch('2024-06-10T02:00:00'), 'open', 'payment', 'Bug 3', 'This is yet another bug report.');
