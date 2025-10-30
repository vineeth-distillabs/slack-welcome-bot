const { App } = require('@slack/bolt');

// Initialize the Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Welcome message template - Distill Labs custom message
const getWelcomeMessage = (userName) => {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey ${userName}! 👋\n\nWelcome to *distil labs* - excited to have you here!`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Here's your quick start guide:*"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "✨ Say hello in <#C09P07LF45D|introductions>"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "🚀 *Get started with the app*\n<https://app.distillabs.ai/|Launch distil labs app>"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "⚡ *Get started with the API*\n<https://docs.distillabs.ai/getting-started/overview#minimal-example|View API quickstart>"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "📖 *Full documentation*\n<https://docs.distillabs.ai/|Explore our docs>"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "🆘 *Need help?*\nAsk in <#C093WMCLP34|support> - we're here to help!"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Can't wait to see what you build! 🎉"
        }
      }
    ]
  };
};

// Listen for new team members
app.event('team_join', async ({ event, client, logger }) => {
  try {
    const userId = event.user.id;
    
    // Get user info to get their name
    const userInfo = await client.users.info({
      user: userId
    });
    
    const userName = userInfo.user.real_name || userInfo.user.name;
    
    // Send welcome DM
    const result = await client.chat.postMessage({
      channel: userId, // Sending DM by using user ID as channel
      ...getWelcomeMessage(userName)
    });
    
    logger.info(`Welcome message sent to ${userName} (${userId})`);
    console.log(`✅ Welcomed ${userName}!`);
  } catch (error) {
    logger.error('Error sending welcome message:', error);
    console.error('❌ Error:', error);
  }
});

// Start the app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Slack Welcome Bot is running on port ${port}!`);
  console.log('🤖 Waiting for new members to welcome...');
})();
