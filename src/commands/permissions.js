/**
 * Analyze Discord role permissions and hierarchy
 */

const { Events, PermissionFlagsBits } = require('discord.js');
const { createClient, validateInputs, setupErrorHandlers, connectClient, fetchGuild } = require('../utils/client');
const { createSeparator, formatTableRow } = require('../utils/formatters');

/**
 * Gets permission names from a permission bitfield
 * @param {bigint} permissions - Permission bitfield
 * @returns {Array<string>} Array of permission names
 */
function getPermissionNames(permissions) {
	const permissionNames = [];
	const permissionMap = {
		[PermissionFlagsBits.CreateInstantInvite]: 'Create Instant Invite',
		[PermissionFlagsBits.KickMembers]: 'Kick Members',
		[PermissionFlagsBits.BanMembers]: 'Ban Members',
		[PermissionFlagsBits.Administrator]: 'Administrator',
		[PermissionFlagsBits.ManageChannels]: 'Manage Channels',
		[PermissionFlagsBits.ManageGuild]: 'Manage Server',
		[PermissionFlagsBits.AddReactions]: 'Add Reactions',
		[PermissionFlagsBits.ViewAuditLog]: 'View Audit Log',
		[PermissionFlagsBits.PrioritySpeaker]: 'Priority Speaker',
		[PermissionFlagsBits.Stream]: 'Stream',
		[PermissionFlagsBits.ViewChannel]: 'View Channels',
		[PermissionFlagsBits.SendMessages]: 'Send Messages',
		[PermissionFlagsBits.SendTTSMessages]: 'Send TTS Messages',
		[PermissionFlagsBits.ManageMessages]: 'Manage Messages',
		[PermissionFlagsBits.EmbedLinks]: 'Embed Links',
		[PermissionFlagsBits.AttachFiles]: 'Attach Files',
		[PermissionFlagsBits.ReadMessageHistory]: 'Read Message History',
		[PermissionFlagsBits.MentionEveryone]: 'Mention Everyone',
		[PermissionFlagsBits.UseExternalEmojis]: 'Use External Emojis',
		[PermissionFlagsBits.ViewGuildInsights]: 'View Server Insights',
		[PermissionFlagsBits.Connect]: 'Connect',
		[PermissionFlagsBits.Speak]: 'Speak',
		[PermissionFlagsBits.MuteMembers]: 'Mute Members',
		[PermissionFlagsBits.DeafenMembers]: 'Deafen Members',
		[PermissionFlagsBits.MoveMembers]: 'Move Members',
		[PermissionFlagsBits.UseVAD]: 'Use Voice Activity',
		[PermissionFlagsBits.ChangeNickname]: 'Change Nickname',
		[PermissionFlagsBits.ManageNicknames]: 'Manage Nicknames',
		[PermissionFlagsBits.ManageRoles]: 'Manage Roles',
		[PermissionFlagsBits.ManageWebhooks]: 'Manage Webhooks',
		[PermissionFlagsBits.ManageEmojisAndStickers]: 'Manage Emojis and Stickers',
		[PermissionFlagsBits.UseApplicationCommands]: 'Use Application Commands',
		[PermissionFlagsBits.RequestToSpeak]: 'Request to Speak',
		[PermissionFlagsBits.ManageEvents]: 'Manage Events',
		[PermissionFlagsBits.ManageThreads]: 'Manage Threads',
		[PermissionFlagsBits.CreatePublicThreads]: 'Create Public Threads',
		[PermissionFlagsBits.CreatePrivateThreads]: 'Create Private Threads',
		[PermissionFlagsBits.UseExternalStickers]: 'Use External Stickers',
		[PermissionFlagsBits.SendMessagesInThreads]: 'Send Messages in Threads',
		[PermissionFlagsBits.UseEmbeddedActivities]: 'Use Embedded Activities',
		[PermissionFlagsBits.ModerateMembers]: 'Moderate Members',
		[PermissionFlagsBits.ViewCreatorMonetizationAnalytics]: 'View Creator Monetization Analytics',
		[PermissionFlagsBits.UseSoundboard]: 'Use Soundboard',
		[PermissionFlagsBits.CreateGuildExpressions]: 'Create Guild Expressions',
		[PermissionFlagsBits.CreateEvents]: 'Create Events',
		[PermissionFlagsBits.UseExternalSounds]: 'Use External Sounds',
		[PermissionFlagsBits.SendVoiceMessages]: 'Send Voice Messages',
	};

	Object.entries(permissionMap).forEach(([flag, name]) => {
		if ((permissions & BigInt(flag)) === BigInt(flag)) {
			permissionNames.push(name);
		}
	});

	return permissionNames;
}

/**
 * Fetches and analyzes role permissions
 * @param {string} botToken - Discord bot token
 * @param {string} guildId - Discord guild ID
 */
async function analyzePermissions(botToken, guildId) {
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
					console.log(`📋 Analyzing permissions for: ${guild.name} (${guild.id})\n`);

					// Fetch all roles
					const roles = await guild.roles.fetch();
					const rolesArray = Array.from(roles.values()).sort((a, b) => b.position - a.position);

					if (rolesArray.length === 0) {
						console.log('⚠️  No roles found in this guild.');
						resolve();
						return;
					}

					console.log(`Found ${rolesArray.length} role(s) to analyze:\n`);

					// Display role hierarchy
					console.log(createSeparator(100));
					console.log('ROLE HIERARCHY (sorted by position, highest first):');
					console.log(createSeparator(100));
					console.log(formatTableRow(['ROLE NAME', 'POSITION', 'PERMISSIONS COUNT', 'ADMINISTRATOR'], [30, 10, 18, 15]));
					console.log(createSeparator(100));

					rolesArray.forEach((role) => {
						const permissions = role.permissions;
						const permissionCount = getPermissionNames(permissions).length;
						const isAdmin = permissions.has(PermissionFlagsBits.Administrator) ? 'Yes' : 'No';
						console.log(formatTableRow([role.name, role.position, permissionCount, isAdmin], [30, 10, 18, 15]));
					});

					console.log(createSeparator(100));
					console.log('');

					// Analyze permissions
					const adminRoles = rolesArray.filter((r) => r.permissions.has(PermissionFlagsBits.Administrator));
					const rolesWithManageRoles = rolesArray.filter((r) => r.permissions.has(PermissionFlagsBits.ManageRoles));
					const rolesWithKickMembers = rolesArray.filter((r) => r.permissions.has(PermissionFlagsBits.KickMembers));
					const rolesWithBanMembers = rolesArray.filter((r) => r.permissions.has(PermissionFlagsBits.BanMembers));

					console.log('📊 Permission Analysis:\n');
					console.log(`   Roles with Administrator: ${adminRoles.length}`);
					if (adminRoles.length > 0) {
						console.log(`      ${adminRoles.map((r) => r.name).join(', ')}`);
					}

					console.log(`   Roles with Manage Roles: ${rolesWithManageRoles.length}`);
					if (rolesWithManageRoles.length > 0) {
						console.log(`      ${rolesWithManageRoles.map((r) => r.name).join(', ')}`);
					}

					console.log(`   Roles with Kick Members: ${rolesWithKickMembers.length}`);
					if (rolesWithKickMembers.length > 0) {
						console.log(`      ${rolesWithKickMembers.map((r) => r.name).join(', ')}`);
					}

					console.log(`   Roles with Ban Members: ${rolesWithBanMembers.length}`);
					if (rolesWithBanMembers.length > 0) {
						console.log(`      ${rolesWithBanMembers.map((r) => r.name).join(', ')}`);
					}

					console.log('');

					// Check for potential issues
					console.log('⚠️  Potential Issues:\n');

					// Check for roles that can manage roles higher than themselves
					const issues = [];
					rolesArray.forEach((role) => {
						if (role.permissions.has(PermissionFlagsBits.ManageRoles)) {
							const rolesAbove = rolesArray.filter((r) => r.position > role.position);
							if (rolesAbove.length > 0) {
								issues.push(`   ${role.name} can manage roles above it (${rolesAbove.map((r) => r.name).join(', ')})`);
							}
						}
					});

					if (issues.length > 0) {
						issues.forEach((issue) => console.log(issue));
					} else {
						console.log('   No obvious permission conflicts detected.');
					}

					console.log('');

					// Detailed permission breakdown for each role
					console.log(createSeparator(100));
					console.log('DETAILED PERMISSION BREAKDOWN:');
					console.log(createSeparator(100));

					rolesArray.forEach((role) => {
						if (role.id === guild.id) {
							// Skip @everyone role
							return;
						}

						const permissions = getPermissionNames(role.permissions);
						console.log(`\n${role.name} (Position: ${role.position}):`);
						if (permissions.length === 0) {
							console.log('   No special permissions');
						} else {
							permissions.forEach((perm) => {
								console.log(`   - ${perm}`);
							});
						}
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
		console.error('❌ Error analyzing permissions:', error.message);
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

module.exports = { analyzePermissions };
