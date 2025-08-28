const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alert')
    .setDescription('Markiert den Ticket-Ersteller und warnt vor Auto-Schließung.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({
        content: 'Dieser Befehl kann nur in Ticket-Kanälen verwendet werden.',
        ephemeral: true
      });
    }

    const username = channel.name.replace('ticket-', '');
    const member = interaction.guild.members.cache.find(m => m.user.username.toLowerCase() === username);

    if (!member) {
      return interaction.reply({
        content: 'Ticket-Ersteller konnte nicht gefunden werden.',
        ephemeral: true
      });
    }

    // Markierung + Hinweis im Channel
    await interaction.reply({
      content: `🔔 ${member}, du wurdest vom Support markiert. Bitte antworte innerhalb von **1 Stunde**, sonst wird das Ticket automatisch geschlossen.`,
      allowedMentions: { users: [member.id] }
    });

    // DM senden
    try {
      await member.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('⚠️ Ticket-Alert')
            .setDescription('Der Support wartet auf deine Antwort. Bitte antworte innerhalb von **1 Stunde**, sonst wird dein Ticket automatisch geschlossen.')
            .setColor('#ff9d00')
            .setTimestamp()
        ]
      });
    } catch (err) {
      console.warn(`❗ Konnte ${member.user.tag} keine Alert-DM senden.`);
    }

    const timeout = setTimeout(async () => {
      try {
        const fetched = await channel.messages.fetch({ limit: 50 });
        const responseFromUser = fetched.some(msg => msg.author.id === member.id);

        if (responseFromUser) {
          console.log(`[INFO] ${member.user.tag} hat geantwortet, Ticket bleibt offen.`);
          return;
        }

        if (channel && channel.deletable) {
          await channel.send(`⌛ Keine Antwort vom Ersteller – Ticket wird automatisch geschlossen.`);
          await channel.delete();

          // DM zum Timeout
          try {
            await member.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle('⌛ Ticket automatisch geschlossen')
                  .setDescription('Dein Ticket wurde geschlossen, da innerhalb von 1 Stunde keine Antwort kam.')
                  .setColor('#FF0000')
                  .setTimestamp()
              ]
            });
          } catch (err) {
            console.warn(`❗ Konnte ${member.user.tag} keine Timeout-DM senden.`);
          }
        }
      } catch (error) {
        console.error('Fehler beim Timeout-Schließen:', error);
      }
    }, 60 * 60 * 1000); // 1 Stunde
  }
};
