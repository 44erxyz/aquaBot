const { Events, EmbedBuilder } = require('discord.js');
const { LogChannelId } = require('../config.json');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    try {
      const channel = await member.guild.channels.fetch(LogChannelId);
      if (channel && channel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('<:botoffline:1399623589531222116> Mitglied verlassen')
          .setDescription(`<:denter:1399623272395440128> ${member.user.tag} hat den Server verlassen.`)
          .addFields(
            { name: 'Benutzer-ID', value: member.id, inline: true },
            { name: 'Beigetreten am', value: new Date(member.joinedTimestamp).toLocaleDateString(), inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setImage(member.guild.iconURL({ dynamic: true }))
          .setURL(member.user.displayAvatarURL())
          .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
          .setTimestamp()
          .setFooter({ text: 'Dein Name.net', iconURL: member.guild.iconURL() });

        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Fehler beim Senden des Leave-Embeds:', error);
    }
  },
};
