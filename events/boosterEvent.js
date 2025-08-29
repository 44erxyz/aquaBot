const { Events, EmbedBuilder } = require('discord.js');
const { boosterChannel_ID } = require('../config.json');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        const guild = newMember.guild;

        // Check if the member has boosted the server
        if (oldMember.premiumSince === null && newMember.premiumSince !== null) {
            const channel = guild.channels.cache.get(boosterChannel_ID);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setTitle('Thank you for boosting!')
                    .setDescription(`Thanks ${newMember} for boosting the server! 🎉`)
                    .setColor('#FFD700')
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            }
        }
    }
};