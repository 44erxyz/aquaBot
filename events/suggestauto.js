const { Events } = require('discord.js');
const { Suggestion_ID } = require('../config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Nicht auf eigene Nachrichten reagieren
        if (message.author.bot) return;

        // Nur im gewünschten Channel reagieren
        if (message.channel.id !== Suggestion_ID) return;

        try {
            await message.react('👍');
            await message.react('👎');
        } catch (error) {
            console.error('❌ Fehler beim Reagieren:', error);
        }
    }
};

//Funktioniert noch nicht