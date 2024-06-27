-- Drop the users table if it exists
DROP TABLE IF EXISTS users;

-- Drop the tickets table if it exists
DROP TABLE IF EXISTS tickets;

-- Drop the comments table if it exists
DROP TABLE IF EXISTS comments;

-- Create the users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
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
    ('admin1', 'c51da19530d6ae5f06b174998dad5856faa7ec2dc68041f7$5ddfb175202c523044b07be66f408900b80ff1fcf9e8ef59b8e12d15a96d3c4552553711066915e1515576be54f72e22bf7554fe8efa7c05dffc4642dfdd9b4e', 1),
    ('admin2', 'bfa0c2fe57d0ce20814aa5ea385f3cee8d998af50a9ed886$327a667ce81c206ce0549d923748b219d2883b2cae6969373c7d67f29872dbc0d22f78631cf92d4bba90c8d6cdc01ca0cbdfaaaaa87ca00cbbe38852b5caddf7', 1),
    ('user1', '5c4907b1177bc1d19d1557794bb57331065e96a608907650$68d38716d499fb21145bee772d03567c146019c0551c9f9c5e7ec7f4a9e2c2119df3c8a477f9bb455ac9492124ca2708365362cae7ad2e6c48339c8cf05ba580', 0),
    ('user2', '5053b74dd47dff6445cde40aad23d66edb82137a569d5acb$89409b9f2d9491297dd89bba84b1302142c0a963101f9aeed5fb52b1849acf819f4e7295dfd8ed6f7c157359efcf51547bcb0ef42add1905945ba9ad88ae2e16', 0),
    ('user3', '6d0e474df279a07bb37c44797cda731c6243e2b1fdd55bf8$f6082498b650211fea53aa9e7d06f6ddb85f04ff5fd5b059276131cc617c6051cfcbc8f739e197b403255bfb0a7f03ff55ef4e927e55b410e7570ef987aafbad', 0);

-- Insert some initial data into the tickets table
INSERT INTO tickets (owner_id, created_at, status, category, title, description) VALUES
    (3, unixepoch('2024-01-10T14:45:00'), 'open', 'inquiry', 'Bug 1', 'This is a bug report.'),
    (4, unixepoch('2024-03-01T12:01:10'), 'open', 'maintenance', 'Feature 1', 'This is a feature request.'),
    (5, unixepoch('2024-03-21T17:00:50'), 'closed', 'new feature', 'Bug 2', 'This is another bug report.'),
    (3, unixepoch('2024-05-01T12:00:00'), 'closed', 'administrative', 'Feature 2', 'This is another feature request.'),
    (4, unixepoch('2024-06-10T02:00:00'), 'open', 'payment', 'Bug 3', 'This is yet another bug report.');
