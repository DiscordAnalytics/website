export const discordjs = `// Import Discord.js's client and intents
const { Client, IntentsBitField } = require("discord.js")
// import discord-analytics
const { default: DiscordAnalytics } = require("@discordanalytics/discordjs")

// Create Discord client
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds] // This intent is required
});

// Create Discord Analytics instance
// Don't forget to replace YOUR_API_TOKEN by your Discord Analytics token !
const analytics = new DiscordAnalytics({
  client: client,
  api_key: 'YOUR_API_TOKEN',
  sharded: false // Set it to true if your bot use shards
});

// When Discord client is ready
client.on('clientReady', async () => {
  await analytics.init();
  analytics.trackEvents();
  console.log("Bot is ready!");
});

// Login to Discord
// Don't forget to replace token by your Discord bot token !
client.login('token');`

export const oceanic = `// Import Oceanic.js's client
const { Client } = require("oceanic.js")
// import discordanalytics
const { default: DiscordAnalytics } = require("@discordanalytics/oceanic")

// Create Discord client
const client = new Client({
  auth: "Bot YOUR_BOT_TOKEN",
  gateway: {
    intents: ["GUILDS"] // This intent is required
  }
})

// Create Discord Analytics instance
// Don't forget to replace YOUR_API_TOKEN by your Discord Analytics token !
const analytics = new DiscordAnalytics({
  client,
  api_key: 'YOUR_API_TOKEN'
});

// When Discord client is ready
client.on('ready', async () => {
  await analytics.init();
  // start tracking selected events
  analytics.trackEvents();
  console.log("Bot is ready!");
});

// Login to Discord
// Don't forget to replace token by your Discord bot token !
client.connect();`

export const discordpy = `import discord
from discordanalytics import DiscordAnalytics

class MyClient(discord.Client):
  async def on_ready(self):
    print(f'Logged on as {self.user}!')

intents = discord.Intents.default()
intents.message_content = True
client = MyClient(intents=intents)

analytics = DiscordAnalytics(client, "YOUR_API_TOKEN")
analytics.track_events()

client.run('TOKEN')`
