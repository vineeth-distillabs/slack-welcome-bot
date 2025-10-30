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
          text: `Hey ${userName}! 👋`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Welcome to distil labs - excited to have you here!\n\nHere's your quick start guide:\n\n✨ Say hello in #introductions\n🚀 Get started with the app: https://app.distillabs.ai/\n⚡ Get started with the API: https://docs.distillabs.ai/getting-started/overview#minimal-example\n📖 Full documentation: https://docs.distillabs.ai/\n🆘 Need help? Ask in #support - we're here to help!\n\nCan't wait to see what you build! 🎉"
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
