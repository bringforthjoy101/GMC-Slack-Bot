const { App, LogLevel } = require('@slack/bolt');
require('dotenv').config();

// Message log storage
const messageLog = [];

// Initialize the Slack Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.INFO,
});

// ─── Event: Respond to all messages ───────────────────────────────────
app.message(async ({ message, say, client, logger }) => {
  // Skip bot messages and subtypes (edits, deletes, etc.)
  if (message.subtype || message.bot_id) return;

  const userInfo = await client.users.info({ user: message.user });
  const username = userInfo.user?.real_name || userInfo.user?.name || message.user;
  const timestamp = new Date(parseFloat(message.ts) * 1000).toISOString();

  // Log the message
  const logEntry = {
    timestamp,
    user: username,
    userId: message.user,
    channel: message.channel,
    text: message.text,
  };
  messageLog.push(logEntry);
  logger.info(`Message logged: ${JSON.stringify(logEntry)}`);

  // Respond with acknowledgment
  await say(`Hey ${username} 👋 I received your message!`);
});

// ─── Command: /hello ───────────────────────────────────────────────────
app.command('/hello', async ({ command, ack, respond }) => {
  await ack();

  const userInfo = await app.client.users.info({ user: command.user_id });
  const username = userInfo.user?.real_name || userInfo.user?.name || command.user_id;

  await respond({
    response_type: 'in_channel',
    text: `Hello, ${username}! 🎉 Welcome to the channel. I'm your GMC Slack Bot. Type any message and I'll respond, or use /hello to greet me!`,
  });
});

// ─── Command: /log — Show recent messages ───────────────────────────────
app.command('/log', async ({ command, ack, respond }) => {
  await ack();

  if (messageLog.length === 0) {
    await respond({ text: 'No messages logged yet.' });
    return;
  }

  const recent = messageLog.slice(-10).map(
    (entry) => `• *${entry.user}* (${entry.timestamp}): ${entry.text}`
  ).join('\n');

  await respond({
    response_type: 'ephemeral',
    text: `*Recent messages (last 10):*\n${recent}`,
  });
});

// ─── Command: /help ────────────────────────────────────────────────────
app.command('/help', async ({ command, ack, respond }) => {
  await ack();

  await respond({
    response_type: 'ephemeral',
    text: '🤖 *GMC Slack Bot Commands*\n• `/hello` — Greet the bot\n• `/log` — View recent logged messages\n• `/help` — Show this help message\n\nI also respond to any message in the channel!',
  });
});

// ─── Start the app ─────────────────────────────────────────────────────
(async () => {
  try {
    await app.start();
    console.log('⚡ GMC Slack Bot is running!');
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
})();