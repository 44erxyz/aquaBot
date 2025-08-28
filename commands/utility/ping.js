const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Zeigt die Bot-Latenz in ms und eine Bossbar-Auslastung.'),
		
	async execute(interaction) {
		const ping = Date.now() - interaction.createdTimestamp;
		const apiPing = interaction.client.ws.ping;

		// Prozentuale Auslastung basierend auf Ping (kannst du anpassen)
		const usage = Math.min(Math.round((ping / 300) * 100), 100);

		// Bossbar generieren (10 Blöcke)
		const blocks = 10;
		const filled = Math.round((usage / 100) * blocks);
		const empty = blocks - filled;
		const bar = '▰'.repeat(filled) + '▱'.repeat(empty); // oder '▰▱'

		const embed = new EmbedBuilder()
			.setColor('#004A82')
			.setTitle('🏓 Pong!')
			.setDescription(`Hier sind die aktuellen Latenz-Informationen:`)
			.addFields(
				{ name: 'Bot-Latenz', value: `${ping}ms`, inline: true },
				{ name: 'API-Latenz', value: `${apiPing}ms`, inline: true },
				{ name: 'Auslastung', value: `${usage}%`, inline: true },
				{ name: 'Bossbar', value: `\`${bar}\``, inline: false },
			)
			.setFooter({ text: `Angefordert von ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
