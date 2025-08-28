const {
  Events,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  StringSelectMenuBuilder
} = require('discord.js');
const { TICKET_CATEGORY_ID, TICKET_LOG_CHANNEL_ID } = require('../config.json');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const { guild, member } = interaction;

    // === 1. Select-Menü zum Ticket-Erstellen ===
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
      const existing = guild.channels.cache.find(
        c => c.name === `ticket-${member.user.username.toLowerCase()}` && c.parentId === TICKET_CATEGORY_ID
      );
      if (existing) {
        return interaction.reply({ content: 'Du hast bereits ein offenes Ticket!', ephemeral: true });
      }

      const selectedCategory = interaction.values[0];

      const modal = new ModalBuilder()
        .setCustomId(`ticket_reason_modal_${selectedCategory}`)
        .setTitle(`Ticket: ${selectedCategory}`);

      const reasonInput = new TextInputBuilder()
        .setCustomId('ticket_reason')
        .setLabel('Worum geht es?')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(10)
        .setMaxLength(400)
        .setPlaceholder('Beschreibe dein Anliegen...')
        .setRequired(true);

      const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
      modal.addComponents(firstActionRow);

      return interaction.showModal(modal);
    }

    // === 2. Modal-Einsendung nach Auswahl ===
    if (interaction.type === InteractionType.ModalSubmit && interaction.customId.startsWith('ticket_reason_modal')) {
      const reason = interaction.fields.getTextInputValue('ticket_reason');
      const category = interaction.customId.split('ticket_reason_modal_')[1];

      const existing = guild.channels.cache.find(
        c => c.name === `ticket-${member.user.username.toLowerCase()}` && c.parentId === TICKET_CATEGORY_ID
      );
      if (existing) {
        return interaction.reply({ content: 'Du hast bereits ein offenes Ticket!', ephemeral: true });
      }

      try {
        const channel = await guild.channels.create({
          name: `ticket-${member.user.username}`,
          type: ChannelType.GuildText,
          parent: TICKET_CATEGORY_ID,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: member.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            },
            // Optional: weitere Supportrollen hinzufügen
          ],
        });

        const embed = new EmbedBuilder()
          .setTitle(`🎫 Ticket – ${category}`)
          .setDescription(`Hallo ${member}, dein Ticket wurde erstellt.\n\n**Grund:** ${reason}`)
          .setColor('#00AAFF')
          .setTimestamp()
          .setFooter({ text: 'DeinName.net', iconURL: guild.iconURL() });

        const closeButton = new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Ticket schließen')
          .setEmoji('🔒')
          .setStyle(ButtonStyle.Danger);

        const transcriptButton = new ButtonBuilder()
          .setCustomId('transcript_ticket')
          .setLabel('Transkript')
          .setEmoji('📜')
          .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(closeButton, transcriptButton);

        await channel.send({ content: `${member}`, embeds: [embed], components: [row] });

        await interaction.reply({ content: `🎟️ Dein Ticket wurde erstellt: ${channel}`, ephemeral: true });

        try {
          await member.send({
            embeds: [
              new EmbedBuilder()
                .setTitle('📬 Ticket erstellt')
                .setDescription(`**Kategorie:** ${category}\n**Grund:** ${reason}\n**Channel:** ${channel.name}`)
                .setColor('#00FF00')
                .setTimestamp()
            ]
          });
        } catch {
          console.warn('❗ DM beim Erstellen nicht gesendet.');
        }

      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Fehler beim Erstellen des Tickets.', ephemeral: true });
      }
    }

    // === 3. Ticket schließen ===
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
      if (!interaction.channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: 'Dieser Button funktioniert nur in Ticket-Kanälen.', ephemeral: true });
      }

      const ticketOwnerName = interaction.channel.name.replace('ticket-', '');
      const ticketMember = guild.members.cache.find(m => m.user.username.toLowerCase() === ticketOwnerName);

      if (ticketMember) {
        try {
          await ticketMember.send({
            embeds: [
              new EmbedBuilder()
                .setTitle('📪 Ticket geschlossen')
                .setDescription('Dein Ticket wurde vom Team geschlossen.')
                .setColor('#FF0000')
                .setTimestamp()
            ]
          });
        } catch {
          console.warn('❗ DM konnte nicht gesendet werden.');
        }
      }

      await interaction.channel.delete();
    }

    // === 4. Transkript erstellen ===
    if (interaction.isButton() && interaction.customId === 'transcript_ticket') {
      if (!interaction.channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: 'Dieser Button funktioniert nur in Ticket-Kanälen.', ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        const sorted = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

        let transcript = `Transkript für ${interaction.channel.name}\n\n`;
        for (const msg of sorted.values()) {
          const time = new Date(msg.createdTimestamp).toLocaleString();
          transcript += `[${time}] ${msg.author.tag}: ${msg.content}\n`;
        }

        const logChannel = await guild.channels.fetch(TICKET_LOG_CHANNEL_ID);
        if (!logChannel || !logChannel.isTextBased()) {
          return interaction.editReply('Transkript-Log-Kanal nicht gefunden.');
        }

        const parts = transcript.match(/[\s\S]{1,1900}/g);
        for (const [i, part] of parts.entries()) {
          await logChannel.send({
            content: `📜 Transkript Teil ${i + 1} – ${interaction.channel.name}`,
            files: [{ attachment: Buffer.from(part, 'utf-8'), name: `${interaction.channel.name}_part${i + 1}.txt` }],
          });
        }

        await interaction.editReply('✅ Transkript wurde im Log-Kanal gespeichert!');
      } catch (err) {
        console.error(err);
        await interaction.editReply('❌ Fehler beim Erstellen des Transkripts.');
      }
    }
  }
};
