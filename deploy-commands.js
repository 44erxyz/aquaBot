const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

// Kommandos sammeln
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] Command ${filePath} is missing "data" or "execute".`);
		}
	}
}

// REST-Client vorbereiten
const rest = new REST().setToken(token);

// Kommandos für jede Guild-ID deployen
(async () => {
	try {
		console.log(`Deploying ${commands.length} commands to ${guildId.length} guild(s)...`);

		for (const id of guildId) {
			const data = await rest.put(
				Routes.applicationGuildCommands(clientId, id),
				{ body: commands },
			);
			console.log(`✅ Erfolgreich ${data.length} Kommandos für Guild ${id} deployed.`);
		}
	} catch (error) {
		console.error('❌ Fehler beim Deploy:', error);
	}
})();
