const { EmbedBuilder } = require('discord.js');

async function handleTextCommands(msg) {

	const content = msg.content;
	const channel = msg.channel;
	const lowerContent = content.toLowerCase();
	const textContent = ['kierio', 'crazy', '😃'];
	if (lowerContent.includes(textContent[0])) msg.reply('kiro*');
	else if (lowerContent.includes(textContent[1])) msg.reply('Crazy?');
	else if (lowerContent.includes(textContent[2])) msg.react('✈️');

	const prefix = '$';
	if (!content.startsWith(prefix)) return false;

	// Extract the command and arguments from the message content
	const args = content.slice(prefix.length).trim().split(' '); // Getting all the arguments after the prefix
	const command = args.shift(); // Getting the first argument (the command)
	console.log(args, command);

	switch (command) {
		case 'ping':
			msg.reply('Pinging...').then((m) => {
				const embed = new EmbedBuilder()
					.setTitle(':ping_pong: Pong!')
					.addFields(
						{
							name: 'Bot Latency',
							value: `\`${m.createdTimestamp - msg.createdTimestamp}ms\``,
						},
						{ name: 'API Latency', value: `\`${msg.client.ws.ping}ms\`` }
					)
					.setColor('Random')
					.setTimestamp();
				m.edit({ embeds: [embed] });
			});
			break;
		case 'say':
			const textArg = content.slice(prefix.length).trim().substring(4);
			!textArg ? msg.reply('No text argument provided!') : msg.reply(textArg);
			break;
		case 'slots':
			const numberArg = args.shift();
			const number = numberArg ? parseInt(numberArg) : 3;
			const guild = msg.guild;
			const emojis = Array.from(guild.emojis.cache.values());
			const numEmojis = emojis.length;

			function getRandomEmoji() {
				const randomIndex = Math.floor(Math.random() * numEmojis);
				return emojis[randomIndex].toString();
			}

			let slots = '';
			let totalLength = 0;
			for (let i = 0; i < number; i++) {
				const emoji = getRandomEmoji();
				const emojiLength = emoji.length + 1; // Adding 1 for the space
				if (totalLength + emojiLength <= 2000) {
					slots += emoji + ' ';
					totalLength += emojiLength;
				} else {
					break; // Break the loop if adding the next emoji exceeds the limit
				}
			}

			// Check if all emojis are the same
			const allEqual = (arr) => arr.every((val) => val === arr[0]);
			const emojiArr = slots.split(' ');
			emojiArr.pop();

			if (slots.length > 2000) {
				emojiArr.pop(); // Truncate if it exceeds 2000 characters
			}

			if (number < 1) {
				msg.reply('What did you think was gonna happen huh?');
				return;
			} else msg.reply(slots);

			const totalOutcomes = Math.pow(numEmojis, number);
			const probability = 1 / totalOutcomes;
			const probabilityAsFraction = `1 out of ${totalOutcomes}`;
			const probabilityAsPercentage = (probability * 100).toFixed(2);

			if (allEqual(emojiArr)) {
				if (number === 1) channel.send(`You won! wait..\nuh?`);
				else
					channel.send(
						`:tada: You won! The chance of winning was ${probabilityAsFraction} (${probabilityAsPercentage}%)`
					);
			} else {
				channel.send('Better luck next time!');
			}

			break;
		case 'temp':
			// Functions for the conversions
			const CelToFah = (celsius) => celsius * 1.8 + 32;
			const CelToKel = (celsius) => celsius + 273.15;
			const FahToCel = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;
			const FahToKel = (fahrenheit) => ((fahrenheit - 32) * 5) / 9 + 273.15;
			const KelToCel = (kelvin) => kelvin - 273.15;
			const KelToFah = (kelvin) => ((kelvin - 273.15) * 9) / 5 + 32;

			// Extract the temperature value, unit, and target unit
			const tempArg = args.shift();
			const toUnitArg = args.shift();

			// Check if the temperature value and target unit are provided
			if (!tempArg || !toUnitArg) {
				msg.reply('Please provide a valid temperature value and target unit.');
				return;
			}

			function fixTemp(str) {
				const chars = str.match(/\D/g); // Searching for non-digit characters
				const dot = str.includes('.'); // Checking if the temp is a float
				return dot ? chars.length - 1 : chars.length;
			}

			// Parse the temperature and unit from the argument
			const fixedArgs = fixTemp(tempArg);
			const fixedTemp = parseFloat(tempArg.slice(0, -fixedArgs)); // Remove the last character (unit)
			const fixedUnit = tempArg.slice(-fixedArgs);

			// Check if the temperature value is valid
			if (isNaN(fixedTemp)) {
				msg.reply('Invalid temperature value.\nPlease provide a valid number.');
				return;
			}

			// Arrays for the valid arguments
			const cel = ['c', 'cel', 'celsius'];
			const fah = ['f', 'fah', 'fahrenheit'];
			const kel = ['k', 'kel', 'kelvin'];
			const toCel = cel.slice().concat('toc', 'tocel', 'tocelsius');
			const toFah = fah.slice().concat('tof', 'tofah', 'tofahrenheit');
			const toKel = kel.slice().concat('tok', 'tokel', 'tokelvin');

			let setUnit;
			let setToUnit;
			const lowerUnit = fixedUnit.toLowerCase();
			const lowerToUnit = toUnitArg.toLowerCase();

			if (cel.includes(lowerUnit)) setUnit = 'Celsius';
			else if (fah.includes(lowerUnit)) setUnit = 'Fahrenheit';
			else if (kel.includes(lowerUnit)) setUnit = 'Kelvin';

			if (toCel.includes(lowerToUnit)) setToUnit = 'toCelsius';
			else if (toFah.includes(lowerToUnit)) setToUnit = 'toFahrenheit';
			else if (toKel.includes(lowerToUnit)) setToUnit = 'toKelvin';

			console.log(setUnit, setToUnit);

			// Perform temperature conversion based on the provided units
			let result;
			switch (setUnit) {
				case 'Celsius':
					switch (setToUnit) {
						case 'toFahrenheit':
							result = CelToFah(fixedTemp);
							msg.reply(`${fixedTemp}°C is equal to ${result.toFixed(2)}°F`);
							break;
						case 'toKelvin':
							result = CelToKel(fixedTemp);
							msg.reply(`${fixedTemp}°C is equal to ${result.toFixed(2)}K`);
							break;
						default:
							msg.reply(
								'Invalid target unit.\nPlease use `fahrenheit/fah/f/toFahrenheit/toFah/toF` for Fahrenheit or `kelvin/kel/k/toKelvin/toKel/toK` for Kelvin (case-insensitive).'
							);
							break;
					}
					break;
				case 'Fahrenheit':
					switch (setToUnit) {
						case 'toCelsius':
							result = FahToCel(fixedTemp);
							msg.reply(`${fixedTemp}°F is equal to ${result.toFixed(2)}°C`);
							break;
						case 'toKelvin':
							result = FahToKel(fixedTemp);
							msg.reply(`${fixedTemp}°F is equal to ${result.toFixed(2)}K`);
							break;
						default:
							msg.reply(
								'Invalid target unit.\nPlease use `celsius/cel/c/toCelsius/toCel/toC` for Celsius or `kelvin/kel/k/toKelvin/toKel/toK` for Kelvin (case-insensitive).'
							);
							break;
					}
					break;
				case 'Kelvin':
					switch (setToUnit) {
						case 'toCelsius':
							result = KelToCel(fixedTemp);
							msg.reply(`${fixedTemp}K is equal to ${result.toFixed(2)}°C`);
							break;
						case 'toFahrenheit':
							result = KelToFah(fixedTemp);
							msg.reply(`${fixedTemp}K is equal to ${result.toFixed(2)}°F`);
							break;
						default:
							msg.reply(
								'Invalid target unit.\nPlease use `celsius/cel/c/toCelsius/toCel/toC` for Celsius or `fahrenheit/fah/f/toFahrenheit/toFah/toF` for Fahrenheit (case-insensitive).'
							);
							break;
					}
					break;
				default:
					msg.reply(
						'Invalid unit.\nPlease use `celsius/cel/c`, `fahrenheit/fah/f`, or `kelvin/kel/k` (case-insensitive).'
					);
					break;
			}
			break;
		case 'track':
			const tracks = [
				'Luigi Circuit',
				'Moo Moo Meadows',
				'Mushroom Gorge',
				"Toad's Factory",
				'Mario Circuit',
				'Coconut Mall',
				'DK Summit',
				"Wario's Gold Mine",
				'Daisy Circuit',
				'Koopa Cape',
				'Maple Treeway',
				'Grumble Volcano',
				'Dry Dry Ruins',
				'Moonview Highway',
				"Bowser's Castle",
				'Rainbow Road',
				'GCN Peach Beach',
				'DS Yoshi Falls',
				'SNES Ghost Valley 2',
				'N64 Mario Raceway',
				'N64 Sherbet Land',
				'GBA Shy Guy Beach',
				'DS Delfino Square',
				'GCN Waluigi Stadium',
				'DS Desert Hills',
				'GBA Bowser Castle 3',
				"N64 DK's Jungle Parkway",
				'GCN Mario Circuit',
				'SNES Mario Circuit 3',
				'DS Peach Gardens',
				'GCN DK Mountain',
				"N64 Bowser's Castle",
			];
			const tracksAbb = [
				'LC',
				'MMM',
				'MG',
				'TF',
				'MC',
				'CM',
				'DKSC',
				'WGM',
				'DC',
				'KC',
				'MT',
				'GV',
				'DDR',
				'MH',
				'BC',
				'RR',
				'rPB',
				'rYF',
				'rGV2',
				'rMR',
				'rSL',
				'rSGB',
				'rDS',
				'rWS',
				'rDH',
				'rBC3',
				'rDKJP',
				'rMC',
				'rMC3',
				'rPG',
				'rDKM',
				'rBC',
			];

			const abb = args.shift();

			const getTracks = () => {
				if (abb == 'true') {
					return tracksAbb[Math.floor(Math.random() * tracksAbb.length)];
				} else {
					return tracks[Math.floor(Math.random() * tracks.length)];
				}
			};

			msg.reply({ content: `Your random track is: **${getTracks()}**!` });

			break;
		case 'commands':
			// Extract the command argument
			const cmdArg = args.shift();
			let embed;
			if (cmdArg) {
				function buildEmbed(title, desc, fields, footer, color) {
					embed = new EmbedBuilder()
						.setTitle(title ? title : null)
						.setDescription(desc ? desc : null)
						.addFields(fields ? fields : null)
						.setFooter({ text: footer ? footer : null })
						.setColor(color ? color : 'Random')
						.setTimestamp();
				}

				switch (cmdArg) {
					case 'ping':
						buildEmbed(
							'Ping Command',
							'Pong!\nGives Bot and API Latency.\nNo arguments available.',
							null,
							'`$ping`'
						);
						break;
					case 'say':
						buildEmbed(
							'Say Command',
							'Says everything the next argument says.\nArguments:\n`<yourText>` (`$say <yourText>`).'
						);
						break;
					case 'temp':
						buildEmbed(
							'Temperature Command',
							'Converts a given temperature to another unit.',
							[
								{ name: '\n', value: '\n'},
								{ name: 'Usage', value: '`$temp <temperature><unit> <targetUnit>`', inline: true },
								{ name: 'Example', value: '`$temp 32fah toCelsius`\nOutput: 32°F is equal to 0°C', inline: true },
								{ name: '\n', value: '\n'},
								{ name: '<temperature>', value: 'The temperature number you want to convert.' },
								{ name: '<unit>', value: 'The temperature unit you want to convert.\nOptions:\n`celsius/cel/c` for Celsius\n`fahrenheit/fah/f` for Fahrenheit\n`kelvin/kel/k` for Kelvin\n(case-insensitive)' },
								{ name: '<targetUnit>', value: 'The unit you want to convert the temperature to.\nOptions:\n`toCelsius/toCel/toC/celsius/cel/c` for Celsius\n`toFahrenheit/toFah/toF/fahrenheit/fah/f` for Fahrenheit\n`toKelvin/toKel/toK/kelvin/kel/k` for Kelvin\n(case-insensitive)' },
								{ name: '\n', value: '\n'} 
							],
						);
						break;
					case 'slots':
						buildEmbed(
							'Slots Command',
							'Slots through the emojis of the server.\nArguments:\n`<number>` (`$slots <number>`), default: `3`.'
						);
						break;
					case 'track':
						buildEmbed(
							'Track Command',
							'Picks a random track from the game.\nArguments: `<abbreviation>` (`$track <abbreviation>`, default: `false`).'
						);
						break;
					default:
						buildEmbed(
							'Invalid command',
							'Type `$commands` without arguments for the list of all commands.'
						);
						break;
				}
			} else {
				embed = new EmbedBuilder()
					.setTitle('Commands')
					.setDescription(
						'List of all commands.\nDo `$commands <command>` to get more info.'
					)
					.addFields(
						{
							name: '$ping',
							value: 'Gives Bot and API Latency.',
							inline: true,
						},
						{ name: '$say', value: 'Says everything you say.', inline: true },
						{ name: '\n', value: '\n', inline: true },
						{
							name: '$temp',
							value: 'Converts a given temperature to another unit.',
							inline: true,
						},
						{ name: '$slots', value: 'The good ol slots!', inline: true },
						{ name: '\n', value: '\n', inline: true },
						{
							name: '$temp',
							value: 'Converts a given temperature to another unit.',
							inline: true,
						},
						{
							name: '$temp',
							value: 'Converts a given temperature to another unit.',
							inline: true,
						},
						{ name: '\n', value: '\n', inline: true },
						{
							name: '$temp',
							value: 'Converts a given temperature to another unit.',
							inline: true,
						},
						{
							name: '$temp',
							value: 'Converts a given temperature to another unit.',
							inline: true,
						},
						{ name: '\n', value: '\n', inline: true }
					)
					.setColor('Random')
					.setTimestamp();
			}

			msg.reply({ embeds: [embed] });
			break;
		default:
			msg.reply(
				'Invalid command.\nType `$commands` for the list of all commands.'
			);
			break;
	}
}

module.exports = { handleTextCommands };
