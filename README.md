[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Y8bW3OQP)

# Exam #1: "Ticketing system"

## Student: s323351 RAINERI ANDREA ANGELO

## React Client Application Routes

- Route `/`: Main page of the application, showing the list of all tickets submitted to the system
- Route `/login`: Display the login form (modal overlay on the home page)
- Route `/logout`: Route to perform the logout
- Route `/create`: Display the ticket creation form (modal overlay on the home page)

## API Server

All [AUTHENTICATED] API endpoints require a valid session id to be included in the request cookies.

Unless further specified, all response bodies in case of errors have the following format

```json
{
  "message": "some error message",
  "errors": ["error1", "error2"]
}
```

Most endpoints can generically reply with the following HTTP error codes, if no further specified:
| HTTP code | Error description |
|-----------|-------------------|
| 500 | Internal server error (i.e. error accessing the database) |
| 503 | Database is busy, retry operation after `Retry-After` ms value in headers |
| 422 | Invalid request parameters or body contents |
| 401 | Not authenticated/authorized |
| 403 | If user is correctly authenticated but has no rights to perform the requested action |

- POST `/api/users/login`
  - Request
  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```
  - Response [200]
  ```json
  {
    "id": 1,
    "username": "username",
    "isAdmin": true
  }
  ```
- POST `/api/users/logout` [AUTHENTICATED]
  - No request body
  - Response [200], no body
- GET `/api/users/me` [AUTHENTICATED]
  - No request parameters
  - Response [200]
  ```json
  {
    "id": 1,
    "username": "username",
    "isAdmin": true
  }
  ```
- GET `/api/users/auth-token`
  - No request parameters
  - Response [200]
  ```json
  {
    "token": "jwt"
  }
  ```
- GET `/api/tickets`
  - No request parameters
  - Response [200]
  ```json
  [
    {
      "id": 1,
      "ownerId": 1,
      "ownerUsername": "username",
      "createdAt": 1719704388,
      "status": "status",
      "category": "category",
      "title": "title",
      "description": null // only authenticated users
    }
  ]
  ```
- POST `/api/tickets` [AUTHENTICATED]
  - Request
  ```json
  {
    "category": "category",
    "title": "title",
    "description": "description"
  }
  ```
  - Response [201]
  ```json
  {
    "id": 1,
    "ownerId": 1,
    "ownerUsername": null,
    "createdAt": 1719704388,
    "status": "open",
    "category": "category",
    "title": "title",
    "description": "description"
  }
  ```
  - Response [404]
  ```json
  {
    "message": "Ticket not found"
  }
  ```
- GET `/api/tickets/:ticketId` [AUTHENTICATED]
  - Request parameter `ticketId`
  - Response [200]
  ```json
  {
    "id": 1,
    "ownerId": 1,
    "ownerUsername": "username",
    "createdAt": 1719704388,
    "status": "open",
    "category": "category",
    "title": "title",
    "description": "description"
  }
  ```
  - Response [404]
  ```json
  {
    "message": "Ticket not found"
  }
  ```
- GET `/api/tickets/:ticketId/comments` [AUTHENTICATED]
  - Request parameter `ticketId`
  - Response [200]
  ```json
  [
    {
      "id": 1,
      "postedAt": 1719562163,
      "authorId": 1,
      "authorUsername": "username",
      "content": "content"
    }
  ]
  ```
- POST `/api/tickets/:ticketId/comments` [AUTHENTICATED]
  - Request parameter `ticketId`
  - Request body
  ```json
  {
    "content": "content"
  }
  ```
  - Response [201]
  ```json
  {
    "message": "Comment added to ticket"
  }
  ```
  - Response [404]
  ```json
  {
    "message": "Ticket not found"
  }
  ```
  - Response [409]
  ```json
  {
    "message": "Cannot add comment to closed ticket"
  }
  ```
- PUT `/api/tickets/:ticketId/status` [AUTHENTICATED]
  - Request parameter `ticketId`
  - Request body
  ```json
  {
    "value": "status"
  }
  ```
  - Response [200]
  ```json
  {
    "message": "Ticket status updated",
    "ticket": {
      "id": 1,
      "ownerId": "1",
      "ownerUsername": "username",
      "createdAt": 1719562163,
      "status": "status",
      "category": "category",
      "title": "title",
      "description", "description"
    }
  }
  ```
  - Response [404]
  ```json
  {
    "message": "Ticket not found"
  }
  ```
- PUT `/api/tickets/:ticketId/category` [AUTHENTICATED (admin only)]
  - Request parameter `ticketId`
  - Request body
  ```json
  {
    "value": "status"
  }
  ```
  - Response [200]
  ```json
  {
    "message": "Ticket category updated",
    "ticket": {
      "id": 1,
      "ownerId": "1",
      "ownerUsername": "username",
      "createdAt": 1719562163,
      "status": "status",
      "category": "category",
      "title": "title",
      "description", "description"
    }
  }
  ```
  - Response [404]
  ```json
  {
    "message": "Ticket not found"
  }
  ```

## API Server2

- GET `/api/ticket-estimate` [JWT AUTHENTICATION]
  - Request body
  ```json
  {
    "title": "title",
    "category": "category"
  }
  ```
  - Response [200]
  ```json
  {
    "estimate": 1,
    "unit": "hours|days"
  }
  ```

## Database Tables

- Table `users` - contains users registered in the system

| Column   | Type    | Attributes                | Allowed values |
| -------- | ------- | ------------------------- | -------------- |
| id       | INTEGER | PRIMARY KEY AUTOINCREMENT |                |
| username | TEXT    | UNIQUE NOT NULL           |                |
| password | TEXT    | NOT NULL                  |                |
| is_admin | INTEGER | NOT NULL                  | 0, 1           |

- Table `tickets` - contains tickets submitted by users

| Column      | Type    | Attributes                | Allowed values                                             |
| ----------- | ------- | ------------------------- | ---------------------------------------------------------- |
| id          | INTEGER | PRIMARY KEY AUTOINCREMENT |                                                            |
| owner_id    | INTEGER | FOREIGN KEY users(id)     |                                                            |
| created_at  | INTEGER | NOT NULL                  | epoch timestamp                                            |
| status      | TEXT    | NOT NULL                  | open, closed                                               |
| category    | TEXT    | NOT NULL                  | administrative, inquiry, maintenance, new feature, payment |
| title       | TEXT    | NOT NULL                  | 1-100 chars                                                |
| description | TEXT    | NOT NULL                  | 1-1000 chars                                               |

- Table `comments` - contains additional text blocks associated to tickets with 1-N relationship

| Column    | Type    | Attributes                | Allowed values  |
| --------- | ------- | ------------------------- | --------------- |
| id        | INTEGER | PRIMARY KEY AUTOINCREMENT |                 |
| ticket_id | INTEGER | FOREIGN KEY tickets(id)   |                 |
| author_id | INTEGER | FOREIGN KEY users(id)     |                 |
| posted_at | INTEGER | NOT NULL                  | epoch timestamp |
| content   | TEXT    | NOT NULL                  | 1-1000 chars    |

## Main React Components

- `AppWithProviders` (in `App.jsx`): root element of the application with access to context providers. On load fetches current authentication state, eventually updating the `AuthContext`
- `Layout` (in `components/layout/Layout.jsx`): application layout setup, with Header and main body content
- `Home` (in `pages/Home.jsx`): main application page, managing ticket fetch from API and keeping internal state of the list of tickets
- `NoMatch` (in `pages/NoMatch.jsx`): page to show for any non-matching route
- `TicketsList` (in `components/TicketsList.jsx`): table displaying the list of tickets, received as prop from the `Home` component
- `TicketRow` (in `components/TicketRow.jsx`): row of the table of tickets, manages the display of ticket information according to user role (admin/normal), fetches the resolve time estimate from server2 (if user is admin) and manages the expansion of the ticket details
- `TicketDetails` (in `TicketDetails.jsx`): when mounted from the `TicketRow` component fetches ticket details and manages status and category changes
- `TicketComments` (in `componetns/TicketComments.jsx`): fetches and manages the comments associated to the tickets, rendering them as a list of `CommentBubble`
- `CommentBubble` (in `components/TicketComments.jsx`): displays single comment text blocks, customized according to logged user and comment author
- `CommentInput` (in `components/TicketComments.jsx`): input box for adding new comments to tickets
- `LoginModal` (in `components/LoginModal.jsx`): modal displaying the login form. Shown in overlay inside the `Outlet` in `Home` component
- `CreateTicketModal` (in `components/CreateTicketModal.jsx`): modal displaying the ticket creation form. Shown in overlay inside the `Outlet` in `Home` component. Manages the state of the current ticket being created (`title, category, description`) and controls the steps in ticket creation (edit/review)
- `EditTicketForm` (in `components/CreateTicketModal.jsx`): editable form for title, category and description input of the new ticket being submitted
- `ReviewTicketForm` (in `components/CreateTicketModal.jsx`): read-only view of the ticket, performing automatic request of time estimate to server2
- `ToastProvider` (in `components/Toast/ToastProvider.jsx`): wrapper to add global toast notification support to all child components, keeping the state of all currently displayed toast. Provider of `ToastContext`
- `ToastContainer` (in `components/Toast/ToastContainer.jsx`): displays all active toasts on the bottom-right edge of the page

## Context Providers

- `AuthContext`: context providing global access to login status and user informations
- `ToastContext`: context providing global access to common interface for toast notification display

## hooks

- `useAuth` (in `hooks/useAuth.jsx`): interface to access `AuthContext`
- `useToast` (in `hooks/useToast.jsx`): interface to access `ToastContext`

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

| username | password | role  |
| -------- | -------- | ----- |
| admin1   | password | admin |
| admin2   | password | admin |
| user1    | password | user  |
| user2    | password | user  |
| user3    | password | user  |
