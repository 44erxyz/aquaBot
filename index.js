const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, async (client) => {
  console.log(`✅ Logged in als ${client.user.tag}`);

  // 🔁 Rotierende Statusmeldungen (mit gültiger Streaming-URL)
  const statuses = [
    {
      name: 'name | /gamefeed',
      type: 1,
      url: 'https://twitch.tv/Dein Name'
    },
    {
      name: '@Dein NameNetwork',
      type: 3,
      url: 'https://twitch.tv/Dein Name'
    },
    {
      name: 'Dein Name | Discord.gg/Dein Name',
      type: 1,
      url: 'https://twitch.tv/Dein Name'
    }
  ];

  let index = 0;

  setInterval(() => {
    const currentStatus = statuses[index];
    client.user.setPresence({
      status: 'online',
      activities: [currentStatus]
    });
    index = (index + 1) % statuses.length;
  }, 10000); // alle 20 Sekunden

  // ✅ Start-Embed senden
  const channelId = '1394095606275768545';
  const channel = await client.channels.fetch(channelId).catch(console.error);

  if (channel && channel.isTextBased()) {
    const embed = new EmbedBuilder()
      .setColor('#00FF00') // Grün
      .setTitle('<:info:1399515932312735938> Bot start')
      .setDescription('<:info:1399515932312735938> Der Bot wurde neu gestartet und ist jetzt online!')
      .setTimestamp()
      .setFooter({ text: 'Dein Name.net', iconURL: client.user.displayAvatarURL() });

    channel.send({ embeds: [embed] });
  }
});

process.on('SIGINT', async () => {
  try {
    const offchannelid = '1394095606275768545';
    const channel = await client.channels.fetch(offchannelid);

    if (channel && channel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setColor('#7c0000')
        .setTitle('<:1324872624257503292:1399515791044644894> Bot herunterfahren')
        .setDescription('<:1324872624257503292:1399515791044644894> Der Bot wird nun heruntergefahren.')
        .setTimestamp()
        .setFooter({ text: 'Dein Name.net', iconURL: client.user.displayAvatarURL() });

      await channel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Fehler beim Senden der Shutdown-Nachricht:', error);
  } finally {
    process.exit(0); // sauberer Exit
  }
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(token);
