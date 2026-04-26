const { sendLog, sendError } = require('../utils/logger');

function extractIdsFromEmbed(embed) {
  const ids = [];

  if (embed.fields && embed.fields.length > 0) {
    embed.fields.forEach((field) => {
      const valueMatch = field.value.match(/ID:\s*`(\d+)`/);
      if (valueMatch) ids.push(valueMatch[1]);
    });
  }

  if (embed.description) {
    const matches = embed.description.match(/ID:\s*`(\d+)`/g);
    if (matches) {
      matches.forEach(match => {
        const id = match.match(/\d+/)[0];
        if (!ids.includes(id)) ids.push(id);
      });
    }
  }

  return ids;
}

// New format: type 17 container with type 10 text blocks
function extractIdsFromComponents(components) {
  const ids = [];
  if (!components || !components.length) return ids;

  for (const row of components) {
    if (row.type === 17 && row.components) {
      for (const child of row.components) {
        if (child.type === 10 && child.content) {
          const matches = child.content.match(/ID:\s*`(\d+)`/g);
          if (matches) {
            matches.forEach(match => {
              const id = match.match(/\d+/)[0];
              if (!ids.includes(id)) ids.push(id);
            });
          }
        }
      }
    }
  }

  return ids;
}

async function handleIDExtractorReaction(reaction, user) {
  const message = reaction.message;

  try {
    await reaction.users.remove(user);
    await reaction.users.remove(reaction.client.user);
  } catch (error) {
    sendError('Failed to remove reactions:', error);
  }

  let ids = [];

  if (message.embeds.length) {
    ids = extractIdsFromEmbed(message.embeds[0]);
  }

  if (!ids.length && message.components.length) {
    ids = extractIdsFromComponents(message.components);
  }

  if (!ids.length) return;

  try {
    await message.channel.send(ids.join(','));
  } catch (error) {
    sendError('Failed to send ID list:', error);
  }
}

module.exports = {
  handleIDExtractorReaction,
  extractIdsFromEmbed
};
