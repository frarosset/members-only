# members-only

**Members Only** is an exclusive clubhouse-style message board web application built using HTML, CSS, and JavaScript. 

A Node.js + Express server renders views with EJS, while data are stored in a PostgreSQL database. Authentication is handler through Passport.js, using the Local Strategy.

<br>

> 🔗 A preview is available [here](https://members-only-ltzm.onrender.com/)

<br>

## Features

* **User Authentication & Authorization**: Secure sign-up, login, and logout functionality powered by `Passport.js` (local strategy) and session-based authentication.

* **Role-Based Access Control**: Four access levels with different permissions: guest, authenticated user, club member, and admin. Messages display different levels of information depending on the user's permissions.

  - **Messaging System**: Only authenticated users can post messages, which can be marked as public, users-only, or members-only. Unread message counts are displayed where appropriate.
  - **Guest Mode**: Guests can browse public content without creating an account.
  - **Membership System**: Users can join the club by solving a riddle to unlock member-only information.
  - **Admin Message Moderation**: Administrators can delete any message. A secret passcode is required to obtain administrator privileges.

* **User Profiles**: Users can view their own profile and message history, while members can browse the public profiles of other users.

* **Persistent Data Storage**: A PostgreSQL database is used to persistently store user accounts, messages, and session data.

* **Data Integrity & Security**:
  - Secure password hashing with `bcryptjs`.
  - Post/Redirect/Get (PRG) pattern implementation to prevent duplicate form submissions.
  - Server-side and client-side validation.

* **Real-Time Updates for New Messages**: WebSockets are used to notify connected users when database content changes, such as when a new message is posted. When a notification is received, pages displaying messages are refreshed to show the latest data (*).

* **Multi-Tab Synchronization**: Broadcast Channels are used to keep a user's session state synchronized across multiple tabs sharing the same session. This ensures that signup, login, logout, and user state changes are immediately reflected across all open tabs through refreshes (*).

* **Responsive UI**: Responsive layouts and custom dialogs.

> (*) A more efficient approach would be to make an API request and retrieve only the updated data as JSON, updating only the relevant parts of the page without a full refresh. Since APIs are outside the scope of the lesson this project is based on, this functionality has been intentionally omitted to keep the focus on authentication, authorization, and permissions management.

<br>

## User Levels & Capabilities

The application features a progressive access control system that unlocks enhanced capabilities as users elevate their status:

* **Guests**: Visitors without an account. They can only view public messages, although their author names and timestamps are not shown.
* **Registered Users**: Users who have created an account. They can post and read public and users-only messages, but author identities and timestamps remain hidden.
* **Members**: Registered users who have successfully solved a riddle to join the club. This unlocks full visibility into author names, timestamps, and user profiles, as well as the ability to read and post members-only messages.
* **Administrators**: Special members equipped with moderation privileges. In addition to member features, they can delete any unwanted message. A secret admin password is required to become an admin.

The features available for each type of user are summarized in the matrix below:

<table>
  <thead>
    <tr>
      <th></th>
      <th>Guests</th>
      <th>Registered</br>Users</th>
      <th>Members</th>
      <th>Admins</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th align="left" colspan="5" >Read Messages</th>
    </tr>
    <tr>
      <td>• Public messages</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <td>• Users-only messages</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <td>• Members-only messages</td>
      <td align="center">-</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <th align="left" colspan="5"><b>Post Messages</b></th>
    </tr>
    <tr>
      <td>• Public messages</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <td>• Users-only messages</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <td>• Members-only messages</td>
      <td align="center">-</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <th align="left" colspan="5"><b>View Additional Info</b></th>
    </tr>
    <tr>
      <td>• Message author names</td>
      <td align="center">-</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <td>• Message timestamps</td>
      <td align="center">-</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
   <tr>
      <td>• Other user profiles</td>
      <td align="center">-</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <th align="left" colspan="5"><b>Delete Messages</b></th>
    </tr>
    <tr>
      <td>• Own messages</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
      <td align="center">&check;</td>
    </tr>
    <tr>
      <td>• Any message (moderation)</td>
      <td align="center">-</td>
      <td align="center">-</td>
      <td align="center">-</td>
      <td align="center">&check;</td>
    </tr>
  </tbody>
</table>

<br>

## Database Schema

The database schema includes tables for `users` and `messages`. 

A `session` table is handled by `express-session` and is used to store info about the current session: whether a user is a guest, flash messages, auth status (through `Passport.js`) and so on. 

Possible nouns and traits allowed as the solution of the riddle to join the club are stored in the `membership_riddle_nouns` and `membership_riddle_traits` tables.

The diagram below was generated from a **.dbml** file derived from the PostgreSQL **.sql** schema. It visualizes the core tables and their connections:

![database diagram](https://raw.githubusercontent.com/frarosset/members-only/refs/heads/main/db/schema-members-only.png)

<br>

## Tech Stack

- **Node.js** – JavaScript runtime for the server
- **Express.js** – Web framework for routing and server logic
- **EJS** – Embedded JavaScript templating for HTML rendering
- **PostgreSQL** – Relational database for persistent message storage
- **pg** – Node.js client for PostgreSQL
- **Vanilla JavaScript / HTML / CSS** – Frontend logic and layout

 ### Authentication & Sessions
- **bcryptjs** – Password hashing and verification
- **express-session** – Session management middleware
- **connect-pg-simple** – PostgreSQL session store for Express sessions
- **Passport.js** – Authentication middleware
- **passport-local** – Local username/password authentication strategy

### Validation & Utilities
- **express-validator** – Input validation middleware
- **express-async-handler** – Simplifies async route handlers
- **dotenv** – Loads environment variables from `.env` files

### Real-Time Communication
- **ws** – WebSocket implementation for real-time client-server messaging

<br>

## Setup

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

### Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/frarosset/members-only.git
   cd members-only
   ```
   
1. **Install dependencies:**
   ```bash
   npm install
   ```

1. **Initialize the database:**

   Initialize a PostgreSQL database and obtain its connection URI
   ```bash
   postgresql://<your_user>:<your_password>@<host>:<port>/<your_db>
   ```
1. **Configure Environment Variables:**

   Create a `.env` file in the root directory (use `.env.example` as a reference)

1. **Run the application:**
   ```Bash
   node app.js
   ```
   And run the application:
   ```Bash
   http://localhost:<port>.
   ```
