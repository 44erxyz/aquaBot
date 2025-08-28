const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Erstellt das Ticket-Panel für allgemeine Anliegen'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Allgemeines Support-Ticket')
      .setDescription('Klicke auf **Ticket erstellen**, wenn du Hilfe brauchst.\n⏱️ Antwortzeit bis zu 48 Stunden.')
      .setColor(0x5865F2)
      .setFooter({ text: 'Powered by ticketsbot.net' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('Ticket erstellen')
        .setEmoji('🎫')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};