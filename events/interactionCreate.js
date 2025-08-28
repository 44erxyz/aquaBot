
if (interaction.customId === 'close_ticket') {
  await interaction.deferUpdate();
  const thread = interaction.channel;
  if (!thread.isThread()) return;


  const messages = await thread.messages.fetch({ limit: 100 });
  const transcript = messages
    .reverse()
    .map(m => `[${m.createdAt.toLocaleString('de-DE')}] ${m.author.tag}: ${m.content}`)
    .join('\n');

  const chunks = [];
  let current = '';
  for (const line of transcript.split('\n')) {
    if ((current + line + '\n').length > 1900) {
      chunks.push(current);
      current = '';
    }
    current += line + '\n';
  }
  if (current.trim()) chunks.push(current);

  // Log-Kanal
  const logChannel = interaction.guild.channels.cache.get('CHANNEL_iD');
  if (logChannel) {
    await logChannel.send(`📜 **Transcript für ${thread.name}**`);
    for (const chunk of chunks) {
      await logChannel.send({ content: `\`\`\`ansi\n${chunk}\`\`\`` });
    }
  }

  await thread.send('📜 Transcript gespeichert. Kanal wird in 5 Sekunden geschlossen.');
  setTimeout(() => thread.delete(), 5_000);
}