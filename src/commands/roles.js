/**
 * Fetch and display all Discord roles from a guild
 */

const { Events } = require('discord.js');
const { createClient, validateInputs, setupErrorHandlers, connectClient, fetchGuild } = require('../utils/client');
const { createSeparator, formatAsArray, formatAsCommaSeparated, formatAsObject, formatTableRow } = require('../utils/formatters');
const { writeJSON } = require('../utils/fileWriter');

/**
 * Fetches and displays all roles from a guild
 * @param {string} botToken - Discord bot token
 * @param {string} guildId - Discord guild ID
 */
async function fetchRoles(botToken, guildId) {
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
					console.log(`📋 Fetching roles from: ${guild.name} (${guild.id})\n`);

					// Fetch all roles
					const roles = await guild.roles.fetch();
					const rolesArray = Array.from(roles.values()).sort((a, b) => b.position - a.position);

					if (rolesArray.length === 0) {
						console.log('⚠️  No roles found in this guild.');
						resolve();
						return;
					}

					console.log(`Found ${rolesArray.length} role(s):\n`);
					console.log(createSeparator(80));
					console.log(formatTableRow(['ROLE NAME', 'ROLE ID', 'POSITION'], [30, 20, 10]));
					console.log(createSeparator(80));

					// Display roles
					rolesArray.forEach((role) => {
						const color = role.hexColor !== '#000000' ? role.hexColor : 'Default';
						console.log(formatTableRow([role.name, role.id, `${role.position} (Color: ${color})`], [30, 20, 30]));
					});

					console.log(createSeparator(80));
					console.log('\n📋 Role IDs (copy-paste format):\n');

					// Output as JavaScript array
					console.log(
						formatAsArray(
							rolesArray,
							(r) => r.id,
							(r) => r.name,
						).replace('const items =', 'const roleIds ='),
					);

					// Output as comma-separated string
					console.log('📋 Comma-separated IDs:');
					console.log(formatAsCommaSeparated(rolesArray, (r) => r.id));
					console.log('');

					// Output as object with names
					console.log('📋 Role IDs with names (object format):');
					console.log(
						formatAsObject(
							rolesArray,
							(r) => r.id,
							(r) => r.name,
						).replace('const items =', 'const roles ='),
					);

					// Special roles highlight
					const everyoneRole = rolesArray.find((r) => r.id === guild.id);
					const botRole = rolesArray.find((r) => r.tags?.botId === client.user.id);
					const managedRoles = rolesArray.filter((r) => r.managed);

					if (everyoneRole) {
						console.log(`ℹ️  @everyone role: ${everyoneRole.id}`);
					}
					if (botRole) {
						console.log(`ℹ️  Bot role: ${botRole.id} (${botRole.name})`);
					}
					if (managedRoles.length > 0) {
						console.log(`ℹ️  Managed roles (${managedRoles.length}): ${managedRoles.map((r) => r.name).join(', ')}`);
					}

					// Save to file
					const fileData = {
						guild: {
							id: guild.id,
							name: guild.name,
						},
						roles: rolesArray.map((role) => ({
							id: role.id,
							name: role.name,
							position: role.position,
							color: role.hexColor,
							managed: role.managed,
							mentionable: role.mentionable,
							hoist: role.hoist,
							permissions: role.permissions.bitfield.toString(),
							createdAt: role.createdAt.toISOString(),
						})),
						statistics: {
							total: rolesArray.length,
							everyoneRole: everyoneRole ? everyoneRole.id : null,
							botRole: botRole ? { id: botRole.id, name: botRole.name } : null,
							managedCount: managedRoles.length,
							managedRoles: managedRoles.map((r) => ({ id: r.id, name: r.name })),
						},
					};

					const filepath = writeJSON('roles', fileData, guild.id);
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
		console.error('❌ Error fetching roles:', error.message);
		if (error.code === 50001) {
			console.error("   The bot doesn't have access to this guild.");
		} else if (error.code === 10004) {
			console.error('   Guild not found. Check the guild ID.');
		} else if (error.code === 50013) {
			console.error("   The bot doesn't have permission to view roles.");
		}
		throw error;
	} finally {
		client.destroy();
	}
}

module.exports = { fetchRoles };
