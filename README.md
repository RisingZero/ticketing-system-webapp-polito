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

- GET `/api/something`
  - request parameters
  - response body content

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

- username, password (plus any other requested info which depends on the text)
- username, password (plus any other requested info which depends on the text)
