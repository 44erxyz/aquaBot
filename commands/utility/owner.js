const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owner')
		.setDescription('Replies with the owner information.'),
        
	async execute(interaction) {
		const ownerEmbed = new EmbedBuilder()
            .setColor('#004A82')
            .setTitle('<:23786proprietaire:1397210659703488622> Owner Information')
            .setDescription('<:13431profil:1397210594729525268> The owner of DeinServer is <@490568777604399104>.')
            .setFooter({ text: 'DeinServer', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();
		await interaction.reply({ embeds: [ownerEmbed] });
        await interaction.followUp({
            content: 'If you have any questions or need assistance, feel free to reach out to the owner.',
            ephemeral: true
        });
	},
};