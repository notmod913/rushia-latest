require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const https = require('https');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

function downloadEmoji(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

function extractEmojis(text) {
  const emojiRegex = /<a?:(\w+):(\d+)>/g;
  const emojis = [];
  let match;
  
  while ((match = emojiRegex.exec(text)) !== null) {
    const [full, name, id] = match;
    const isAnimated = full.startsWith('<a:');
    const ext = isAnimated ? 'gif' : 'png';
    const url = `https://cdn.discordapp.com/emojis/${id}.${ext}`;
    emojis.push({ name, id, url, ext });
  }
  
  return emojis;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;
  
  const content = message.content.replace(`<@${client.user.id}>`, '').trim();
  const messageId = content.match(/^\d+$/)?.[0];
  
  if (!messageId) return;
  
  try {
    const targetMessage = await message.channel.messages.fetch(messageId);
    
    if (!targetMessage.embeds.length) {
      await message.reply('❌ No embeds found in that message.');
      return;
    }
    
    const allEmojis = [];
    
    for (const embed of targetMessage.embeds) {
      const embedText = JSON.stringify(embed.toJSON());
      const emojis = extractEmojis(embedText);
      allEmojis.push(...emojis);
    }
    
    if (allEmojis.length === 0) {
      await message.reply('❌ No custom emojis found in the embeds.');
      return;
    }
    
    const downloadDir = path.join(__dirname, 'downloaded_emojis');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    
    await message.reply(`⏳ Downloading ${allEmojis.length} emoji${allEmojis.length > 1 ? 's' : ''}...`);
    
    const downloaded = [];
    const failed = [];
    
    for (const emoji of allEmojis) {
      let filepath = path.join(downloadDir, `${emoji.name}.${emoji.ext}`);
      
      // Handle duplicates by adding number suffix
      let counter = 1;
      while (fs.existsSync(filepath)) {
        filepath = path.join(downloadDir, `${emoji.name}_${counter}.${emoji.ext}`);
        counter++;
      }
      
      try {
        await downloadEmoji(emoji.url, filepath);
        downloaded.push(emoji.name);
      } catch (err) {
        failed.push(emoji.name);
      }
    }
    
    let response = `✅ Downloaded ${downloaded.length} emoji${downloaded.length !== 1 ? 's' : ''} to \`downloaded_emojis/\``;
    if (failed.length > 0) {
      response += `\n❌ Failed: ${failed.join(', ')}`;
    }
    
    await message.reply(response);
    
  } catch (error) {
    console.error('Error:', error);
    await message.reply('❌ Error: Could not fetch message or download emojis.');
  }
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log('Usage: @bot <message_id>');
});

client.login(process.env.BOT_TOKEN);
