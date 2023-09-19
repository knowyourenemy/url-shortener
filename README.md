# URL Shortener

Demo: [https://shrtn.net](https://shrtn.net)

## Getting Started

### Prerequisites

Before running the application, ensure you have the following software and tools installed:

- [Node.js](https://nodejs.org/) (with npm)

### Installation

1. Clone this repository to your local machine

2. Create `.env` files

```bash
(cd server && touch .env)
(cd client && touch .env.development)
(cd client && touch .env.production)
```

3. Add environment variables to `.env` files. If you do not have access to these, please contact me.

4. Install dependencies

```bash
npm i
(cd client && npm i)
(cd server && npm i)
```

5. Start application

```bash
npm run dev
```

The client will be available at `http://localhost:3000` and the server at `http://localhost:8000`.

## Project Structure

### Server

The application server is a REST API implemented using Express, TypeScript, and MongoDB.

### Client

The client is a single-page application implemented using React and TypeScript.

### Deployment

Both the server and client are containerised using Docker and deployed to seperate Google Cloud Run services. I configured the https://shrtn.net domain such that the the root domain maps to the client while the https://api.shrtn.net subdomain maps to the server.

## Features

### User authentication

This application uses session-based authentication to authenticate users. Session information is stored in the client's browser cookies, and is verified using custom middleware in the backend server. When a user refreshes the website, they are automatically logged in if they have a valid (un-expired) session ID in their cookies.

### Persistence

All shortened URLs and user accounts are stored in a MongoDB Atlas cluster. This allows the data to be persisted across system reboots, and enables the database to be scaled independently.

### Testing

The server uses Jest to test the application at a route, helper, and model level. An in-memory Mongo database is used in place of an actual MongoDB Atlas cluster during tests.

### Responsive UI

The client UI is responsive to enable the website to be used on different screen sizes. It acheives this predominantly through CSS Media Queries.

## Possible Improvements

### Better architechture

As of now, when a user inputs a shortened URL in the browser (e.g. https://shrtn.net/Wm7nB), the client redirects the user to the server (e.g. https://api.shrtn.net/url/Wm7nB), which then redirects the user to the original URL (e.g. https://www.tech.gov.sg/capability-centre-gds). This architechture could be improved if the user can bypass the client and go straight to the server. This could be achieved by hosting the client and server in the same domain, and using a reverse-proxy to automatically route certain requests to the client and other requests to the server.

### CI/CD

As of now, I deploy both the client and server by manually running commands on my computer terminal. This process could be automated using GitHub actions to build, dockerise, and deploy the application.

### More testing

The application currently only contains a few test cases for the server. More tests need to be added for the server, client, as well as end-to-end tests.

### Better UI

While the UI is responsive, it could certainly be improved (especially for mobile screens) to give a better user experience.
