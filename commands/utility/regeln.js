const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regeln')
    .setDescription('Zeigt die Regeln an.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#004A82')
      .setTitle('Regeln | Dein Name')
      .setDescription('Hier sind die aktuellen Regeln:')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setImage('https://cdn.discordapp.com/attachments/1394095606275768545/1399655685259657340/ChatGPT_Image_29._Juli_2025_08_39_48.png?ex=688a732f&is=688921af&hm=644a2bbde0e3265f495f50ec4c2a4f491bd2a2db54e427c88a9f6706aea350bb')
      .addFields(
        { name: '§1.0 Namensgebung', value: 'Namen dürfen keine Beleidigungen oder andere verbotene oder geschützte Inhalte enthalten.' },
        { name: '§1.1 Avatar', value: 'Avatare dürfen keine pornographischen, rassistischen oder beleidigenden Inhalte beinhalten.' },
        { name: '§2.0 Umgangston', value: 'Der Umgang mit anderen Discord Benutzern sollte stets freundlich sein. Verbale Angriffe gegen andere User sind strengstens untersagt.' },
        { name: '§2.1 Gespräche aufnehmen', value: 'Das Mitschneiden von Gesprächen ist nur nach Absprache erlaubt. Ohne Einwilligung verboten.' },
        { name: '§2.2 Abwesenheit', value: 'Bei längerer Abwesenheit bitte in den AFK-Channel gehen.' },
        { name: '§3.0 Kicken/Bannen', value: 'Kicks/Banns sind begründet und dienen der Erziehung. Unangemessene Maßnahmen bitte Admins melden.' },
        { name: '§3.1 Discord Rechte', value: 'Rechte werden nur nach Bedarf vergeben.' },
        { name: '§3.2 Weisungsrecht', value: 'Admins und Manager haben volles Weisungsrecht. Verweigerung kann zu Strafen führen.' },
        { name: '§4.0 Datenschutz', value: 'Private Daten dürfen nicht öffentlich geteilt werden.' },
        { name: '§5.0 Werbung', value: 'Werbung ist nicht gestattet und wird sanktioniert.' },
        { name: '§6.0 Discord Nutzungsbedingungen', value: '[Hier klicken für die offiziellen Discord Nutzungsbedingungen](https://discord.com/terms)' }
      )
      .setFooter({ text: 'Dein Name - Leitung' });

    const button = new ButtonBuilder()
      .setLabel('Discord Terms öffnen')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/terms');

    const row = new ActionRowBuilder().addComponents(button);
    await interaction.channel.send({ embeds: [embed] });

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
