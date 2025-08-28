const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Schicke das Ticket-Panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Kanal zum Senden des Panels')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (!channel || !channel.isTextBased()) {
      return interaction.reply({ content: 'Bitte wähle einen gültigen Textkanal aus.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor('#004A82')
      .setTitle('<:info:1399515932312735938> Ticket-System | Dein Name ')
      .setDescription('Wähle eine Kategorie aus, um ein Ticket zu erstellen.')
      .setFooter({ text: 'Dein Name.net', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_menu')
      .setPlaceholder('🎟️ Wähle eine Kategorie...')
      .addOptions(
        {
          label: '📦 Bestellung',
          description: 'Support zu deinem Kauf oder Paket',
          value: 'order_support',
        },
        {
          label: '🛠️ Technischer Support',
          description: 'Fehler oder Probleme mit dem Server',
          value: 'technical_support',
        },
        {
          label: '📜 Bewerbung',
          description: 'Bewirb dich beim Team',
          value: 'application',
        }
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Das Panel wurde erfolgreich gesendet!', ephemeral: true });
  }
};
