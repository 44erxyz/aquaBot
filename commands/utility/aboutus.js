const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('aboutus')
    .setDescription('Informationen über DeinServer')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#004A82')
      .setTitle('<:info:1399515932312735938> | Information')
      .setDescription('Everything you need to know about us.')
      .addFields(
        {
          name: '<a:zAU_spinneryellow:1399623472388505631> Server IP',
          value: `Europe: \`play.DeinServer.net\``
        },
        {
          name: '<:50494lien:1399622954953867355> Links',
          value:
            `[Store](https://DeinServer.net/store)\n` +
            `[Website](https://DeinServer.net)\n` +
            `[Twitter](https://twitter.com/DeinServer)\n` +
            `[TikTok](https://tiktok.com/@DeinServer)\n` +
            `[Rules](https://DeinServer.com/rules)`
        },
        {
          name: '❓ Support',
          value: 'If you need help, create a ticket at https://discord.com/channels/1189688758866550936/1399877655196602510.'
        }
      )
      .setFooter({
        text: 'DeinServer',
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTimestamp();

    // Unsichtbare Reaktion auf den Slash-Befehl (versteckt)
    await interaction.deferReply({ ephemeral: true });

    // Öffentliche Nachricht im Channel
    await interaction.channel.send({ embeds: [embed] });

    // Optional: dem User privat bestätigen, dass es gesendet wurde
    await interaction.editReply({
      content: '✅ Die Info wurde im Channel veröffentlicht.',
      ephemeral: true
    });
  }
};
