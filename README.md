# Event Registration System API

A RESTful API built with **Node.js, Express.js, and MySQL** that allows users to register, authenticate, browse events, and manage event registrations. Organizers can create and manage their own events, while authentication and role-based authorization protect restricted endpoints.

This project was developed as part of the **CodeAlpha Backend Development Internship**.

## Features

### Authentication and Authorization
- User registration and login.
- Password hashing using `bcrypt`.
- JSON Web Token (JWT) authentication.
- Role-based access control for users and organizers.
- JWT tokens expire after one hour.

### Event Management
- View all available events.
- Retrieve details of a specific event.
- Create events as an organizer.
- Update events owned by the authenticated organizer.
- Delete events owned by the authenticated organizer.
- Prevent unauthorized users from modifying another organizer's events.
- Prevent deletion of events that have existing registrations.

### Event Registration
- Authenticated users can register for events.
- Users can view their own registrations.
- Users can cancel their own registrations.
- Duplicate registrations are prevented.
- Users cannot cancel another user's registration.

### Database Management
- MySQL database integration using `mysql2`.
- Relational tables for users, events, and registrations.
- Foreign key constraints to maintain data integrity.
- A unique constraint prevents a user from registering for the same event more than once.

## Technologies Used

- **Node.js** — JavaScript runtime.
- **Express.js** — Web application framework.
- **MySQL** — Relational database.
- **mysql2** — MySQL driver for Node.js.
- **bcrypt** — Password hashing.
- **jsonwebtoken** — JWT-based authentication.
- **dotenv** — Environment variable management.
- **Thunder Client** — API testing in Visual Studio Code.

## Project Structure

```text
CodeAlpha-Event-Registration-System/
│
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── registrationController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── organizerMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── registrationRoutes.js
│
├── .env
├── .gitignore
├── db.js
├── package.json
├── server.js
└── README.md
```

**Note:** The `.env` file contains local configuration and should not be committed to GitHub.

## Prerequisites

Before running this project, ensure you have installed:

- [Node.js](https://nodejs.org/)
- MySQL Server
- Visual Studio Code or another code editor
- Thunder Client, Postman, or another API testing tool

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AETO-07/CodeAlpha-Event-Registration-System.git
```

Replace `YOUR_USERNAME` with your GitHub username.

Navigate into the project directory:

```bash
cd CodeAlpha-Event-Registration-System
```

### 2. Install Dependencies

Run:

```bash
npm install
```

### 3. Create the Database

Open your MySQL client and execute:

```sql
CREATE DATABASE codealpha_event_registration;
```

The application expects the database to contain these tables:

- `users`
- `events`
- `registrations`

Create the tables using the schema configured for this project, including the required foreign keys and unique constraints.

### 4. Configure Environment Variables

Create a `.env` file in the project root directory.

Add your own local configuration:

```env
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=codealpha_event_registration

PORT=3000

JWT_SECRET=replace_with_a_long_random_secret
```

**Important:**

- Use the MySQL port configured on your computer. Change `3307` if your MySQL server uses a different port.
- Replace `your_mysql_password` with your local MySQL password.
- Replace the JWT secret with a strong, private value.
- Never commit your `.env` file or publish your database password or JWT secret.

### 5. Start the Server

Run:

```bash
node server.js
```

If your application starts successfully, the API should be available at:

```text
http://localhost:3000
```

Keep the server running while testing the endpoints.

## API Endpoints

The base URL for local development is:

```text
http://localhost:3000
```

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive a JWT | Public |

### Events

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/events` | Retrieve all events | Public |
| GET | `/api/events/:id` | Retrieve a specific event | Public |
| POST | `/api/events` | Create a new event | Organizer |
| PUT | `/api/events/:id` | Update an event | Owning organizer |
| DELETE | `/api/events/:id` | Delete an event | Owning organizer |

### Registrations

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/events/:id/register` | Register for an event | Authenticated user |
| GET | `/api/registrations` | View the current user's registrations | Authenticated user |
| DELETE | `/api/registrations/:id` | Cancel a registration | Registration owner |

**Access notes:**

- Public endpoints do not require a JWT.
- Authenticated endpoints require a valid JWT.
- Organizer endpoints require an authenticated account with the organizer role.
- Organizers can only update or delete their own events.
- Users can only view or cancel their own registrations through the protected registration endpoints.

## Example Requests

The following examples illustrate the expected request format. Use the exact fields expected by your controllers.

### 1. Register a User

**POST** `/api/auth/register`

Example JSON body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "your_password"
}
```

A successful request creates a user account. Public registration assigns the regular `user` role.

### 2. Log In

**POST** `/api/auth/login`

Example JSON body:

```json
{
  "email": "john@example.com",
  "password": "your_password"
}
```

A successful login returns a JWT that can be used to access protected endpoints.

### 3. Create an Event

**POST** `/api/events`

This endpoint requires an authenticated organizer.

Example JSON body:

```json
{
  "title": "Introduction to Web Development",
  "description": "A beginner-friendly web development event.",
  "date": "2027-03-20 10:00:00",
  "location": "Lagos, Nigeria"
}
```

The date and time should follow the format accepted by your database and controller.

### 4. Register for an Event

**POST** `/api/events/1/register`

Replace `1` with the ID of the event.

This endpoint requires authentication. A user cannot register for the same event more than once.

### 5. View My Registrations

**GET** `/api/registrations`

This endpoint returns the registrations belonging to the authenticated user.

### 6. Cancel a Registration

**DELETE** `/api/registrations/1`

Replace `1` with the ID of the registration you want to cancel.

A user can cancel only their own registration.

## Authentication

After logging in, copy the JWT returned by the API.

For protected endpoints, include the token in the request's `Authorization` header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Replace `YOUR_JWT_TOKEN` with the actual token.

Tokens expire after one hour, so log in again when a token expires.

## Organizer Role

New accounts created through the public registration endpoint receive the regular `user` role.

To test organizer functionality during local development, an administrator can assign the organizer role directly in the database:

```sql
UPDATE users
SET role = 'organizer'
WHERE email = 'organizer@example.com';
```

Replace the email with the address of an existing account.

After changing a user's role, log in again to obtain a JWT containing the updated role.

This SQL statement is intended for local development and testing. A production application should implement an appropriately secured process for managing organizer privileges.

## Error Handling

The API uses HTTP status codes to communicate request outcomes.

| Status Code | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | A resource was created successfully |
| `400 Bad Request` | Request data is missing, invalid, or malformed |
| `401 Unauthorized` | Authentication is missing or invalid |
| `403 Forbidden` | The authenticated user does not have the required role |
| `404 Not Found` | The requested resource was not found or is not accessible to the current user |
| `409 Conflict` | A duplicate registration or another resource conflict occurred |
| `500 Internal Server Error` | An unexpected server or database error occurred |

The exact status code depends on the endpoint and the condition encountered.

## Testing

The API can be tested using Thunder Client, Postman, or another HTTP client.

Recommended test cases include:

1. Register a new user.
2. Log in with valid credentials.
3. Attempt to log in with an incorrect password.
4. Retrieve the list of events without authentication.
5. Attempt to create an event using a regular user account.
6. Create an event using an organizer account.
7. Attempt to modify an event owned by another organizer.
8. Register for an existing event.
9. Attempt to register for the same event twice.
10. Retrieve the authenticated user's registrations.
11. Attempt to cancel another user's registration.
12. Cancel a registration owned by the authenticated user.
13. Attempt to delete an event that still has registrations.
14. Delete an event owned by the organizer when it has no registrations.

These tests help verify authentication, authorization, input validation, database constraints, and resource ownership.

## Security Considerations

- Passwords are hashed using `bcrypt` rather than stored as plain text.
- Protected routes use JWT authentication.
- Organizer-only operations enforce role-based access control.
- Event ownership is checked before organizers can modify or delete events.
- Registration ownership is checked before cancellation.
- Database constraints help prevent duplicate registrations and invalid relationships.
- Environment variables are used to keep credentials and secrets outside the source code.

For production use, additional measures such as rate limiting, stricter validation, secure deployment configuration, and comprehensive automated tests should be considered.

## Future Improvements

Potential improvements include:

- Event search, filtering, and pagination.
- Event capacity limits.
- Automatic prevention of registrations for past events.
- Email confirmations for registrations.
- Automated unit and integration tests.
- API documentation using Swagger or OpenAPI.
- Deployment to a cloud hosting platform.

## Author

Developed as part of the **CodeAlpha Backend Development Internship**.

**GitHub:** [https://github.com/AETO-07/CodeAlpha-Event-Registration-System]

## License

This project was created for learning and internship purposes. Add a license if you intend to distribute the project under specific terms.