const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); 
// Falls du native fetch von Node 22 nutzt, kannst du die obere Zeile entfernen

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Zeigt Informationen über einen Minecraft-Server an.')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('IP oder Domain des Minecraft-Servers')
        .setRequired(true)
    ),

  async execute(interaction) {
    // IP auslesen
    const ip = interaction.options.getString('ip');
    const apiUrl = `https://api.mcsrvstat.us/2/${ip}`;

    try {
      // Defere die Antwort, damit Discord weiß, dass wir dran sind
      await interaction.deferReply();

      // Daten abrufen
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('API antwortet nicht');
      }
      const data = await response.json();

      // Prüfen ob Server online
      if (!data.online) {
        return interaction.editReply(`❌ Der Server \`${ip}\` ist derzeit **offline** oder existiert nicht.`);
      }

      // Embed bauen
      const embed = new EmbedBuilder()
        .setTitle(`🌍 Minecraft Server: ${data.hostname || ip}`)
        .setColor('#004A82')
        .addFields(
          { name: '📶 Online', value: 'Ja ✅', inline: true },
          { name: '👥 Spieler', value: `${data.players.online ?? 0} / ${data.players.max ?? 0}`, inline: true },
          { name: '📡 IP-Adresse', value: data.ip || ip, inline: true },
          { name: '🌐 Port', value: `${data.port || 'Unbekannt'}`, inline: true },
          { name: '🛠 Version', value: data.version || 'Unbekannt', inline: true },
          { name: '📃 MOTD', value: data.motd?.clean?.join('\n') || 'Nicht verfügbar' }
        )
        .setTimestamp();

      // Antwort editieren (senden)
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Fehler beim Abrufen der Serverdaten:', error);
      if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({ content: '❗ Beim Abrufen des Serverstatus ist ein Fehler aufgetreten.', ephemeral: true });
      } else {
        await interaction.editReply('❗ Beim Abrufen des Serverstatus ist ein Fehler aufgetreten.');
      }
    }
  }
};
