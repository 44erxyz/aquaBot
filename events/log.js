const { Events, EmbedBuilder } = require('discord.js');
const { LogChannelId } = require('../config.json');

module.exports = {
  name: Events.GuildMemberAdd,
  
  async execute(member) {
    try {
      const channel = await member.guild.channels.fetch(LogChannelId);
      if (channel && channel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('<:botonline:1399623161644974102> Neues Mitglied')
          .setDescription(`<:botonline:1399623161644974102> Willkommen auf dem DeinName-Server, ${member.user.tag}!`)
          .addFields(
            { name: 'Benutzer-ID', value: member.id, inline: true },
            { name: 'Beigetreten am', value: new Date(member.joinedTimestamp).toLocaleDateString(), inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setImage(member.guild.iconURL({ dynamic: true }))
          .setURL(member.user.displayAvatarURL())
          .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
          .setTimestamp()
          .setFooter({ text: 'DeinName.net', iconURL: member.guild.iconURL() });

        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Fehler beim Senden des Welcome-Embeds:', error);
    }
  },
};
