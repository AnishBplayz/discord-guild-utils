/**
 * Fetch and display all Discord members from a guild
 */

const { Events } = require('discord.js');
const { createClient, validateInputs, setupErrorHandlers, connectClient, fetchGuild } = require('../utils/client');
const { createSeparator, formatAsArray, formatAsCommaSeparated, formatAsObject, formatTableRow } = require('../utils/formatters');
const { writeJSON } = require('../utils/fileWriter');

/**
 * Fetches and displays all members from a guild
 * @param {string} botToken - Discord bot token
 * @param {string} guildId - Discord guild ID
 */
async function fetchMembers(botToken, guildId) {
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
					console.log(`📋 Fetching members from: ${guild.name} (${guild.id})\n`);

					// Fetch all members with pagination
					console.log('⏳ Fetching members (this may take a while for large servers)...\n');
					const members = await guild.members.fetch();
					const membersArray = Array.from(members.values());

					if (membersArray.length === 0) {
						console.log('⚠️  No members found in this guild.');
						resolve();
						return;
					}

					console.log(`Found ${membersArray.length} member(s):\n`);
					console.log(createSeparator(100));
					console.log(formatTableRow(['USERNAME', 'USER ID', 'DISPLAY NAME', 'ROLES COUNT', 'JOINED'], [25, 20, 20, 12, 20]));
					console.log(createSeparator(100));

					// Display members (limit to first 50 for display, but export all)
					const displayLimit = 50;
					const membersToDisplay = membersArray.slice(0, displayLimit);

					membersToDisplay.forEach((member) => {
						const username = member.user.tag;
						const userId = member.id;
						const displayName = member.displayName || member.user.username;
						const rolesCount = member.roles.cache.size - 1; // Exclude @everyone
						const joinedDate = member.joinedAt ? member.joinedAt.toLocaleDateString() : 'Unknown';

						console.log(formatTableRow([username, userId, displayName, rolesCount, joinedDate], [25, 20, 20, 12, 20]));
					});

					if (membersArray.length > displayLimit) {
						console.log(`\n... and ${membersArray.length - displayLimit} more members (not shown in table)\n`);
					}

					console.log(createSeparator(100));
					console.log('\n📋 Member IDs (copy-paste format):\n');

					// Output as JavaScript array
					console.log(
						formatAsArray(
							membersArray,
							(m) => m.id,
							(m) => m.user.tag,
						).replace('const items =', 'const memberIds ='),
					);

					// Output as comma-separated string
					console.log('📋 Comma-separated IDs:');
					console.log(formatAsCommaSeparated(membersArray, (m) => m.id));
					console.log('');

					// Output as object with names
					console.log('📋 Member IDs with names (object format):');
					console.log(
						formatAsObject(
							membersArray,
							(m) => m.id,
							(m) => m.user.tag,
						).replace('const items =', 'const members ='),
					);

					// Statistics
					const membersWithRoles = membersArray.filter((m) => m.roles.cache.size > 1).length;
					const botMembers = membersArray.filter((m) => m.user.bot).length;
					const humanMembers = membersArray.length - botMembers;

					console.log('\n📊 Member Statistics:');
					console.log(`   Total Members: ${membersArray.length}`);
					console.log(`   Human Members: ${humanMembers}`);
					console.log(`   Bot Members: ${botMembers}`);
					console.log(`   Members with Roles: ${membersWithRoles}`);
					console.log(`   Members without Roles: ${membersArray.length - membersWithRoles}`);

					// Role distribution
					const roleDistribution = {};
					membersArray.forEach((member) => {
						const roleCount = member.roles.cache.size - 1; // Exclude @everyone
						roleDistribution[roleCount] = (roleDistribution[roleCount] || 0) + 1;
					});

					console.log('\n📊 Role Distribution:');
					Object.entries(roleDistribution)
						.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
						.forEach(([roleCount, memberCount]) => {
							console.log(`   ${roleCount} role(s): ${memberCount} member(s)`);
						});

					// Save to file
					const fileData = {
						guild: {
							id: guild.id,
							name: guild.name,
						},
						members: membersArray.map((member) => ({
							id: member.id,
							username: member.user.username,
							discriminator: member.user.discriminator,
							tag: member.user.tag,
							displayName: member.displayName,
							bot: member.user.bot,
							roles: member.roles.cache
								.filter((role) => role.id !== guild.id)
								.map((role) => ({
									id: role.id,
									name: role.name,
								})),
							roleCount: member.roles.cache.size - 1,
							joinedAt: member.joinedAt ? member.joinedAt.toISOString() : null,
							premiumSince: member.premiumSince ? member.premiumSince.toISOString() : null,
							nickname: member.nickname,
						})),
						statistics: {
							total: membersArray.length,
							humans: humanMembers,
							bots: botMembers,
							withRoles: membersWithRoles,
							withoutRoles: membersArray.length - membersWithRoles,
							roleDistribution: Object.fromEntries(Object.entries(roleDistribution).map(([k, v]) => [parseInt(k), v])),
						},
					};

					const filepath = writeJSON('members', fileData, guild.id);
					console.log(`\n💾 Output saved to: ${filepath}`);

					console.log('\n✅ Done!');
					resolve();
				} catch (error) {
					reject(error);
				}
			});

			client.once(Events.Error, reject);
		});
	} catch (error) {
		console.error('❌ Error fetching members:', error.message);
		if (error.code === 50001) {
			console.error("   The bot doesn't have access to this guild.");
		} else if (error.code === 10004) {
			console.error('   Guild not found. Check the guild ID.');
		} else if (error.code === 50013) {
			console.error("   The bot doesn't have permission to view members.");
		}
		throw error;
	} finally {
		client.destroy();
	}
}

module.exports = { fetchMembers };
