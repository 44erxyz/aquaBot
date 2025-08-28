const { Events, EmbedBuilder } = require('discord.js');
const { autoRoleId, welcomeChannelId, serverName } = require('../config.json');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    // Autorole vergeben
    try {
      const role = member.guild.roles.cache.get(autoRoleId);
      if (role) {
        await member.roles.add(role);
        console.log(`Autoroled: ${member.user.tag} -> ${role.name}`);
      } else {
        console.error(`Autorole mit ID ${autoRoleId} nicht gefunden.`);
      }
    } catch (error) {
      console.error('Fehler beim Zuweisen der Autorole:', error);
    }

    // Willkommensnachricht senden
    try {
      const channel = await member.guild.channels.fetch(welcomeChannelId);
      if (channel?.isTextBased()) {
        const joinedAt = member.joinedTimestamp
  ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
  : 'Unbekannt';

const membercount = member.guild.memberCount.toLocaleString('en-US');

const embed = new EmbedBuilder()
  .setColor('#004A82')
  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
  .setAuthor({
    name: 'Dein Name | Welcome System',
    iconURL: 'https://cdn.discordapp.com/attachments/1394095606275768545/1399655333902684191/844ab143-6b00-4182-afd2-10d047b2efa8.png',
  })
  .setTitle('<:new1:1399623215998832751><:new2:1399623324132180078> A new user has joined!')
  .setDescription(`Hey! ${member}, welcome to **Dein Name**!`)
  .addFields(
    {
      name: '<:85722ajouter:1399515738339016748> | User',
      value: `${member.user.tag} (${member})`,
      inline: true,
    },
    {
      name: '<:info:1399515932312735938> | Joined On',
      value: joinedAt,
      inline: true,
    },
    {
      name: '<:1324872692612206644:1399656459465396265> | Info',
      value: 'Look in <#1394095594309554349>',
      inline: false,
    },
    {
      name: '<:BadgeNewMember:1399623737460002896> | **Membercount:**',
      value: `${membercount}`,
      inline: true,
    }
  )
  .setImage('https://cdn.discordapp.com/attachments/1394095606275768545/1399655685259657340/ChatGPT_Image_29._Juli_2025_08_39_48.png')
  .setFooter({ text: 'Welcome System - Dein Name' })
  .setTimestamp();


        await channel.send({ content: `<@${member.id}>`, embeds: [embed] });
      }
    } catch (error) {
      console.error('Fehler beim Senden der Willkommensnachricht:', error);
    }
  },
};
