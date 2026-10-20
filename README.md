# Discussion Hub

A React discussion app for asking questions, sharing answers, finding topic-based discussions, and collaborating through real-time chats. The interface includes an animated dashboard, responsive chat workspace, and a shared violet, teal, and warm neutral visual theme.

## Features

- Browse and search community discussions, with topic filtering and paginated results.
- Create a discussion and contribute answers.
- View a personal dashboard and a list of your own queries.
- Use the Community Knowledge Assistant to search discussion posts and answers, get responses grounded in retrieved passages, and open the cited discussions. If retrieval finds no relevant passages, the assistant labels its answer as general model knowledge and shows no community sources.
- Switch to General AI mode for open-ended questions that do not need community retrieval.
- Find people, send or manage connection requests, and create direct or group conversations.
- Exchange real-time chat messages. Messages are saved by the backend and loaded again when a conversation is reopened.
- Protect account-only pages and return users to the page they requested after login.

## Requirements

- Node.js and npm.
- The Discussion Hub backend running and reachable from the browser. The backend provides the REST API and Socket.IO server, and needs its database and AI service configuration.

## Run locally

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Configure the backend origin. Copy `.env.example` to `.env.local` and set `REACT_APP_API_URL` to the backend origin. For a local backend on port 5000, use:

   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

   The value is the origin only; do not append `/api/v1`. Both REST requests and Socket.IO use this setting. If you use the hosted backend, set the variable to its origin instead.

3. Start the React development server:

   ```bash
   npm start
   ```

   The app opens at [http://localhost:3000](http://localhost:3000).

The home page explains the platform and its features. Browse and search the actual discussion feed at `/discussions`.

The default assistant mode is **Community RAG**. It sends signed-in requests to `POST /api/v1/chat/ask/community` with the stored JWT. The backend embeds the query, retrieves relevant public discussion passages from MongoDB Atlas Vector Search, and asks its configured OpenRouter Gemini model to answer from that evidence. Each user's RAG chats are saved in the history panel; follow-up questions use recent chat turns for context. The UI shows source discussions for each answer. When retrieval returns no relevant evidence, the model answers from general knowledge and the UI clearly labels the fallback without displaying community citations.

Choose **General AI** in the assistant mode switch to use the existing open-ended assistant endpoint. Frontend code does not contain provider keys; configure all AI and vector search credentials on the backend. See [the backend README](../backendofdiscussion-main/README.md) for setup and indexing.

The backend must be running at the configured origin. For chat to work, its Socket.IO server must support the authenticated `NEW_MESSAGE` event and acknowledge messages after saving them.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the development server. |
| `npm run build` | Create an optimized production build in `build/`. |
| `npm test` | Run the Create React App test runner. |

## Main routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Browse and search discussions | Public |
| `/discussions` | Search, filter, and browse the discussion feed | Public |
| `/login` | Sign in | Public |
| `/signup` | Create an account | Public |
| `/discussions/:queid` | Read a discussion and its answers | Public |
| `/ask-share-ques` | Create a discussion | Signed in |
| `/dashboard/my-profile` | View your dashboard | Signed in |
| `/profile/my-queries` | View your discussions | Signed in |
| `/chat` | Chat and manage connection requests | Signed in |
| `/ask/gemini` | Ask the AI assistant | Signed in |

## Project layout

```text
src/
  Chat/                Chat page and conversation list
  Pages/               Route-level pages
  chatcomponents/      Chat, message, and notification components
  components/          Shared UI, discussion, profile, and auth components
  service/             API operations and backend URL configuration
  slice/               Redux state slices
  index.css            Global theme, layout, and component styles
```

## Tech stack

- React 18 and React Router
- Redux Toolkit
- Tailwind CSS with project-specific CSS styling
- Axios for REST requests
- Socket.IO Client for real-time chat
- React Markdown for formatted AI responses
