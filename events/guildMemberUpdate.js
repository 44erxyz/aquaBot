const { Events, EmbedBuilder } = require('discord.js');
const { LogChannelId } = require('../config.json');

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    try {
      const channel = await newMember.guild.channels.fetch(LogChannelId);
      if (!channel || !channel.isTextBased()) return;

      // Beispiel: Überprüfe, ob sich Rollen geändert haben
      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;

      const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
      const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

      const embed = new EmbedBuilder()
        .setColor('#ffb00f')
        .setTitle('<:75565management:1399623378813456427> Mitglied aktualisiert')
        .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
        .setTimestamp()
        .setFooter({ text: 'Dein Name.net', iconURL: newMember.guild.iconURL() });

      if (addedRoles.size > 0) {
        embed.addFields({
          name: '<:botonline:1399623161644974102> Rollen hinzugefügt',
          value: addedRoles.map(r => r.name).join(', '),
          inline: true,
        });
      }

      if (removedRoles.size > 0) {
        embed.addFields({
          name: '<:botoffline:1399623589531222116> Rollen entfernt',
          value: removedRoles.map(r => r.name).join(', '),
          inline: true,
        });
      }

      // Du kannst weitere Checks hinzufügen, z.B. Nickname-Änderungen
      if (oldMember.nickname !== newMember.nickname) {
        embed.addFields({
          name: '<:botoutage:1399677761576243323> Nickname geändert',
          value: `${oldMember.nickname ?? oldMember.user.username} → ${newMember.nickname ?? newMember.user.username}`,
          inline: false,
        });
      }

      if (embed.data.fields.length > 0) {
        await channel.send({ embeds: [embed] });
      }

    } catch (error) {
      console.error('Fehler beim Loggen des GuildMemberUpdate:', error);
    }
  },
};
