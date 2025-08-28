const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bug')
    .setDescription('Erstellt das Bug-Meldungs-Panel'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Bug melden')
      .setDescription('Klicke auf **Bug melden**, wenn du einen Fehler gefunden hast.\n⏱️ Antwortzeit bis zu 72 Stunden.')
      .setColor(0xED4245)
      .setFooter({ text: 'Powered by ticketsbot.net' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_bug')
        .setLabel('Bug melden')
        .setEmoji('🐛')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};