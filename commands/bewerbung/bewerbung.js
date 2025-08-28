const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bewerbung')
    .setDescription('Erstellt das Bewerbungs-Panel'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Team-/Creator-Bewerbung')
      .setDescription('Klicke auf **Bewirb dich**, um eine Bewerbung zu starten.\n⏱️ Antwortzeit bis zu 24 Stunden.\n⚠️ Mindestalter 16 Jahre – Ausnahmen gibt es nicht.')
      .setColor(0xFAA61A)
      .setFooter({ text: 'Powered by ticketsbot.net' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_bewerbung')
        .setLabel('Bewirb dich')
        .setEmoji('📨')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};