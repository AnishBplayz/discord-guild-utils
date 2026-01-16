/**
 * Fetch and display all Discord emojis and stickers from a guild
 */

const { Events } = require('discord.js');
const { createClient, validateInputs, setupErrorHandlers, connectClient, fetchGuild } = require('../utils/client');
const { createSeparator, formatAsArray, formatAsCommaSeparated, formatAsObject, formatTableRow } = require('../utils/formatters');

/**
 * Fetches and displays all emojis and stickers from a guild
 * @param {string} botToken - Discord bot token
 * @param {string} guildId - Discord guild ID
 */
async function fetchEmojis(botToken, guildId) {
	validateInputs(botToken, guildId);

	const client = createClient();
	setupErrorHandlers(client);

	try {
		await connectClient(client, botToken);

		await new Promise((resolve, reject) => {
			client.once(Events.ClientReady, async (readyClient) => {
				try {
					console.log(`✅ Connected as ${readyClient.user.tag}\n`);

					const guild = await fetchGuild(client, guildId);
					console.log(`📋 Fetching emojis and stickers from: ${guild.name} (${guild.id})\n`);

					// Fetch all emojis
					const emojis = await guild.emojis.fetch();
					const emojisArray = Array.from(emojis.values());

					// Fetch all stickers
					const stickers = await guild.stickers.fetch();
					const stickersArray = Array.from(stickers.values());

					if (emojisArray.length === 0 && stickersArray.length === 0) {
						console.log('⚠️  No emojis or stickers found in this guild.');
						resolve();
						return;
					}

					// Display emojis
					if (emojisArray.length > 0) {
						console.log(`Found ${emojisArray.length} emoji(s):\n`);
						console.log(createSeparator(100));
						console.log(formatTableRow(['EMOJI NAME', 'EMOJI ID', 'ANIMATED', 'AVAILABLE', 'MANAGED'], [30, 20, 10, 12, 10]));
						console.log(createSeparator(100));

						emojisArray.forEach((emoji) => {
							const animated = emoji.animated ? 'Yes' : 'No';
							const available = emoji.available ? 'Yes' : 'No';
							const managed = emoji.managed ? 'Yes' : 'No';
							console.log(formatTableRow([emoji.name, emoji.id, animated, available, managed], [30, 20, 10, 12, 10]));
						});

						console.log(createSeparator(100));
						console.log('\n📋 Emoji IDs (copy-paste format):\n');

						// Output as JavaScript array
						console.log(
							formatAsArray(
								emojisArray,
								(e) => e.id,
								(e) => e.name,
							).replace('const items =', 'const emojiIds ='),
						);

						// Output as comma-separated string
						console.log('📋 Comma-separated IDs:');
						console.log(formatAsCommaSeparated(emojisArray, (e) => e.id));
						console.log('');

						// Output as object with names
						console.log('📋 Emoji IDs with names (object format):');
						console.log(
							formatAsObject(
								emojisArray,
								(e) => e.id,
								(e) => e.name,
							).replace('const items =', 'const emojis ='),
						);

						// Emoji format for Discord
						console.log('\n📋 Emoji format (for use in Discord):');
						emojisArray.forEach((emoji) => {
							const format = emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`;
							console.log(`   ${emoji.name}: ${format}`);
						});
						console.log('');

						// Statistics
						const animatedCount = emojisArray.filter((e) => e.animated).length;
						const staticCount = emojisArray.length - animatedCount;
						const availableCount = emojisArray.filter((e) => e.available).length;
						const managedCount = emojisArray.filter((e) => e.managed).length;

						console.log('📊 Emoji Statistics:');
						console.log(`   Total Emojis: ${emojisArray.length}`);
						console.log(`   Animated: ${animatedCount}`);
						console.log(`   Static: ${staticCount}`);
						console.log(`   Available: ${availableCount}`);
						console.log(`   Unavailable: ${emojisArray.length - availableCount}`);
						console.log(`   Managed: ${managedCount}`);
						console.log(`   Custom: ${emojisArray.length - managedCount}`);
						console.log('');
					} else {
						console.log('⚠️  No emojis found in this guild.\n');
					}

					// Display stickers
					if (stickersArray.length > 0) {
						console.log(createSeparator(100));
						console.log(`Found ${stickersArray.length} sticker(s):\n`);
						console.log(createSeparator(100));
						console.log(formatTableRow(['STICKER NAME', 'STICKER ID', 'TYPE', 'AVAILABLE', 'DESCRIPTION'], [25, 20, 15, 12, 30]));
						console.log(createSeparator(100));

						stickersArray.forEach((sticker) => {
							const type = sticker.type === 1 ? 'Standard' : sticker.type === 2 ? 'Guild' : 'Unknown';
							const available = sticker.available ? 'Yes' : 'No';
							const description = sticker.description || 'None';
							console.log(formatTableRow([sticker.name, sticker.id, type, available, description], [25, 20, 15, 12, 30]));
						});

						console.log(createSeparator(100));
						console.log('\n📋 Sticker IDs (copy-paste format):\n');

						// Output as JavaScript array
						console.log(
							formatAsArray(
								stickersArray,
								(s) => s.id,
								(s) => s.name,
							).replace('const items =', 'const stickerIds ='),
						);

						// Output as comma-separated string
						console.log('📋 Comma-separated IDs:');
						console.log(formatAsCommaSeparated(stickersArray, (s) => s.id));
						console.log('');

						// Output as object with names
						console.log('📋 Sticker IDs with names (object format):');
						console.log(
							formatAsObject(
								stickersArray,
								(s) => s.id,
								(s) => s.name,
							).replace('const items =', 'const stickers ='),
						);

						// Statistics
						const availableStickers = stickersArray.filter((s) => s.available).length;
						const guildStickers = stickersArray.filter((s) => s.type === 2).length;

						console.log('\n📊 Sticker Statistics:');
						console.log(`   Total Stickers: ${stickersArray.length}`);
						console.log(`   Available: ${availableStickers}`);
						console.log(`   Unavailable: ${stickersArray.length - availableStickers}`);
						console.log(`   Guild Stickers: ${guildStickers}`);
						console.log(`   Standard Stickers: ${stickersArray.length - guildStickers}`);
						console.log('');
					} else {
						console.log('⚠️  No stickers found in this guild.\n');
					}

					console.log('✅ Done!');
					resolve();
				} catch (error) {
					reject(error);
				}
			});

			client.once(Events.Error, reject);
		});
	} catch (error) {
		console.error('❌ Error fetching emojis:', error.message);
		if (error.code === 50001) {
			console.error("   The bot doesn't have access to this guild.");
		} else if (error.code === 10004) {
			console.error('   Guild not found. Check the guild ID.');
		} else if (error.code === 50013) {
			console.error("   The bot doesn't have permission to view emojis.");
		}
		throw error;
	} finally {
		client.destroy();
	}
}

module.exports = { fetchEmojis };
