const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const PogGuild = require('../database/PogGuild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setpog')
    .setDescription('Set the channel for POG (high-value drop) alerts (SOFI only)')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('The channel to send POG alerts to (leave empty to disable)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('channel-id')
        .setDescription('Or provide channel ID directly')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Check if user is bot owner or has admin permissions
    const BOT_OWNER_ID = process.env.BOT_OWNER_ID;
    const isOwner = interaction.user.id === BOT_OWNER_ID;
    const hasAdmin = interaction.member?.permissions.has(PermissionFlagsBits.Administrator);

    if (!isOwner && !hasAdmin) {
      return await interaction.reply({ 
        content: '❌ You need Administrator permission to use this command.', 
        ephemeral: true 
      });
    }

    try {
      const guildId = interaction.guildId;
      if (!guildId) {
        return await interaction.reply({ 
          content: '❌ This command can only be used in a server.', 
          ephemeral: true 
        });
      }

      const channel = interaction.options.getChannel('channel');
      const channelId = interaction.options.getString('channel-id');

      // If neither provided, disable POG
      if (!channel && !channelId) {
        // Remove POG channel
        await PogGuild.findOneAndUpdate(
          { guild_id: guildId },
          { targetChannelId: null },
          { upsert: true, new: true }
        );
        return await interaction.reply({ 
          content: '✅ POG alerts disabled. No channel will receive high-value drop notifications.', 
          ephemeral: true 
        });
      }

      // Get channel object (either from option or by ID)
      let targetChannel = channel;
      
      if (!targetChannel && channelId) {
        try {
          targetChannel = await interaction.guild.channels.fetch(channelId);
        } catch (error) {
          return await interaction.reply({ 
            content: '❌ Invalid channel ID. Please provide a valid channel ID or mention.', 
            ephemeral: true 
          });
        }
      }

      // Verify it's a text channel
      if (!targetChannel.isTextBased()) {
        return await interaction.reply({ 
          content: '❌ Please select a text channel.', 
          ephemeral: true 
        });
      }

      // Check bot permissions
      const perms = targetChannel.permissionsFor(interaction.guild.members.me);
      if (!perms || !perms.has('SendMessages')) {
        return await interaction.reply({ 
          content: `❌ I don't have permission to send messages in ${targetChannel}.`, 
          ephemeral: true 
        });
      }

      // Save to database
      await PogGuild.findOneAndUpdate(
        { guild_id: guildId },
        { targetChannelId: targetChannel.id },
        { upsert: true, new: true }
      );

      await interaction.reply({ 
        content: `✅ POG alerts will now be sent to ${targetChannel}!\n\n**What are POG alerts?**\nWhen Luvi drops cards with heart values over 99, I'll automatically forward them to this channel with a special alert.`, 
        ephemeral: true 
      });
    } catch (error) {
      console.error('Set POG channel error:', error);
      await interaction.reply({ 
        content: '❌ An error occurred while setting the POG channel.', 
        ephemeral: true 
      });
    }
  }
};
