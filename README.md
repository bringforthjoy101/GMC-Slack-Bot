# GMC Slack Bot

A Slack bot built with Node.js and the Slack Bolt framework. Responds to messages, handles slash commands, and logs messages via the Slack Events API.

## Features

- **Message Response**: Acknowledges every user message in the channel
- **/hello Command**: Greets the user by name
- **/log Command**: Displays the last 10 logged messages
- **/help Command**: Shows available commands
- **Message Logging**: Logs all messages with timestamp, user, channel, and text

## App Details

| Field | Value |
|-------|-------|
| App ID | A0ASPUG4YAZ |
| Client ID | 6749462155300.10907968168373 |
| Created | April 14, 2026 |

## Setup

### Prerequisites

- Node.js 18+ installed
- A Slack workspace where you can install apps
- Slack App created at [api.slack.com/apps](https://api.slack.com/apps)

### Step 1: Configure the Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) and select your app
2. **OAuth & Permissions** → Add these Bot Token Scopes:
   - `chat:write` — Send messages
   - `channels:history` — Read channel messages
3. **Event Subscriptions** → Enable Events API:
   - Subscribe to `message.channels`
   - Subscribe to `message.im`
4. **Socket Mode** → Enable Socket Mode
   - Generate an App-Level Token with `connections:write` scope
5. **Install App** → Install to your workspace and copy the **Bot User OAuth Token** (starts with `xoxb-`)
6. **Basic Information** → Copy the **Signing Secret**

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Copy the example env file and fill in your tokens:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret
```

### Step 4: Run the Bot

```bash
npm start
```

You should see: `⚡ GMC Slack Bot is running!`

### Step 5: Test

1. Invite the bot to a channel: `/invite @GMC Bot`
2. Type a message — the bot will respond
3. Type `/hello` — the bot will greet you
4. Type `/log` — the bot will show recent messages

## Project Structure

```
├── bot.js           # Main bot logic (event handlers, commands)
├── package.json     # Dependencies and scripts
├── .env             # Environment variables (not committed)
├── .env.example     # Example env template
└── README.md        # This file
```

## How It Works

### Authentication
The bot uses **Socket Mode** for authentication, which creates a WebSocket connection to Slack — no need for a public URL or ngrok. The Bot Token (`xoxb-`) authenticates API calls, the App Token (`xapp-`) establishes the socket connection, and the Signing Secret verifies incoming requests.

### Event Handling
The bot subscribes to `message` events via the Slack Events API. When a user sends a message, Slack pushes the event to the bot through the WebSocket. The bot:
1. Filters out bot messages and subtypes (edits, deletes)
2. Looks up the user's real name via the `users.info` API
3. Logs the message with metadata
4. Sends an acknowledgment reply

### Slash Commands
- `/hello` — Responds in-channel with a greeting
- `/log` — Shows the last 10 logged messages (ephemeral, only visible to the user)
- `/help` — Shows available commands (ephemeral)

## Troubleshooting

**Bot not responding?**
- Check that Socket Mode is enabled in your app settings
- Verify all three tokens in `.env` are correct
- Make sure the bot is invited to the channel

**Commands not working?**
- Slash commands must be created in the Slack App settings under "Slash Commands"
- Create `/hello`, `/log`, and `/help` commands pointing to your app

## References

- [Slack API Documentation](https://api.slack.com/)
- [Bolt for JavaScript](https://slack.dev/bolt-js/tutorial/getting-started)
- [Events API Guide](https://api.slack.com/apis/connections/events-api)

## Author

Emmanuel — GMC Software Engineering Master's Program