/**
 * Fetch and display all Discord channels and categories from a guild
 */

const { Events, ChannelType } = require('discord.js');
const { createClient, validateInputs, setupErrorHandlers, connectClient, fetchGuild } = require('../utils/client');
const { createSeparator, formatAsArray, formatAsCommaSeparated, formatAsObject, formatTableRow } = require('../utils/formatters');

/**
 * Gets the channel type name
 * @param {ChannelType} type - Channel type
 * @returns {string} Channel type name
 */
function getChannelTypeName(type) {
	const typeNames = {
		[ChannelType.GuildText]: 'Text',
		[ChannelType.GuildVoice]: 'Voice',
		[ChannelType.GuildCategory]: 'Category',
		[ChannelType.GuildAnnouncement]: 'Announcement',
		[ChannelType.AnnouncementThread]: 'Announcement Thread',
		[ChannelType.PublicThread]: 'Public Thread',
		[ChannelType.PrivateThread]: 'Private Thread',
		[ChannelType.GuildStageVoice]: 'Stage',
		[ChannelType.GuildForum]: 'Forum',
		[ChannelType.GuildMedia]: 'Media',
	};
	return typeNames[type] || 'Unknown';
}

/**
 * Fetches and displays all channels from a guild
 * @param {string} botToken - Discord bot token
 * @param {string} guildId - Discord guild ID
 */
async function fetchChannels(botToken, guildId) {
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
					console.log(`📋 Fetching channels from: ${guild.name} (${guild.id})\n`);

					// Fetch all channels
					const channels = await guild.channels.fetch();
					const channelsArray = Array.from(channels.values());

					if (channelsArray.length === 0) {
						console.log('⚠️  No channels found in this guild.');
						resolve();
						return;
					}

					// Separate categories and regular channels
					const categories = channelsArray.filter((ch) => ch.type === ChannelType.GuildCategory).sort((a, b) => a.position - b.position);
					const regularChannels = channelsArray.filter((ch) => ch.type !== ChannelType.GuildCategory).sort((a, b) => a.position - b.position);

					console.log(`Found ${channelsArray.length} channel(s): ${categories.length} category/categories, ${regularChannels.length} regular channel(s)\n`);

					// Display categories
					if (categories.length > 0) {
						console.log(createSeparator(80));
						console.log('CATEGORIES:');
						console.log(createSeparator(80));
						console.log(formatTableRow(['CATEGORY NAME', 'CATEGORY ID', 'POSITION'], [35, 20, 10]));
						console.log(createSeparator(80));

						categories.forEach((category) => {
							console.log(formatTableRow([category.name, category.id, category.position], [35, 20, 10]));
						});
						console.log(createSeparator(80));
						console.log('');
					}

					// Display regular channels grouped by category
					console.log(createSeparator(80));
					console.log('CHANNELS:');
					console.log(createSeparator(80));
					console.log(formatTableRow(['CHANNEL NAME', 'CHANNEL ID', 'TYPE', 'CATEGORY'], [30, 20, 15, 15]));
					console.log(createSeparator(80));

					regularChannels.forEach((channel) => {
						const categoryName = channel.parent ? channel.parent.name : 'None';
						const typeName = getChannelTypeName(channel.type);
						console.log(formatTableRow([channel.name, channel.id, typeName, categoryName], [30, 20, 15, 15]));
					});

					console.log(createSeparator(80));
					console.log('\n📋 Channel IDs (copy-paste format):\n');

					// Output as JavaScript array
					console.log(
						formatAsArray(
							channelsArray,
							(ch) => ch.id,
							(ch) => ch.name,
						).replace('const items =', 'const channelIds ='),
					);

					// Output as comma-separated string
					console.log('📋 Comma-separated IDs:');
					console.log(formatAsCommaSeparated(channelsArray, (ch) => ch.id));
					console.log('');

					// Output as object with names
					console.log('📋 Channel IDs with names (object format):');
					console.log(
						formatAsObject(
							channelsArray,
							(ch) => ch.id,
							(ch) => ch.name,
						).replace('const items =', 'const channels ='),
					);

					// Statistics
					const channelTypes = {};
					channelsArray.forEach((ch) => {
						const typeName = getChannelTypeName(ch.type);
						channelTypes[typeName] = (channelTypes[typeName] || 0) + 1;
					});

					console.log('\n📊 Channel Statistics:');
					Object.entries(channelTypes).forEach(([type, count]) => {
						console.log(`   ${type}: ${count}`);
					});

					console.log('\n✅ Done!');
					resolve();
				} catch (error) {
					reject(error);
				}
			});

			client.once(Events.Error, reject);
		});
	} catch (error) {
		console.error('❌ Error fetching channels:', error.message);
		if (error.code === 50001) {
			console.error("   The bot doesn't have access to this guild.");
		} else if (error.code === 10004) {
			console.error('   Guild not found. Check the guild ID.');
		} else if (error.code === 50013) {
			console.error("   The bot doesn't have permission to view channels.");
		}
		throw error;
	} finally {
		client.destroy();
	}
}

module.exports = { fetchChannels };
