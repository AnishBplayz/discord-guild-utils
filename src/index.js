/**
 * Main CLI entry point for Discord utility suite
 * Usage: node src/index.js <command> [BOT_TOKEN] [GUILD_ID]
 * Commands: roles, channels, members, emojis, permissions, all
 */

const { fetchRoles } = require('./commands/roles');
const { fetchChannels } = require('./commands/channels');
const { fetchMembers } = require('./commands/members');
const { fetchEmojis } = require('./commands/emojis');
const { analyzePermissions } = require('./commands/permissions');

// Get command line arguments
const command = process.argv[2];
let botToken = process.argv[3];
let guildId = process.argv[4];

// Try to load from config.js if not provided via command line
if (!botToken || !guildId) {
	try {
		const config = require('../config.js');
		botToken = botToken || config.botToken;
		guildId = guildId || config.guildId;
	} catch (error) {
		// config.js doesn't exist or is invalid, that's okay
	}
}

// Available commands
const commands = {
	roles: fetchRoles,
	channels: fetchChannels,
	members: fetchMembers,
	emojis: fetchEmojis,
	permissions: analyzePermissions,
};

/**
 * Runs all commands sequentially
 */
async function runAll(botToken, guildId) {
	const commandOrder = ['roles', 'channels', 'members', 'emojis', 'permissions'];

	for (const cmd of commandOrder) {
		console.log(`\n${'='.repeat(80)}`);
		console.log(`Running: ${cmd.toUpperCase()}`);
		console.log('='.repeat(80));
		try {
			await commands[cmd](botToken, guildId);
		} catch (error) {
			console.error(`❌ Error running ${cmd}:`, error.message);
		}
		// Small delay between commands
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

/**
 * Main function
 */
async function main() {
	// Show usage if no command provided
	if (!command) {
		console.log('Discord Utility Suite');
		console.log('====================\n');
		console.log('Usage: node src/index.js <command> [BOT_TOKEN] [GUILD_ID]\n');
		console.log('Available commands:');
		console.log('  roles        - Fetch and display all roles');
		console.log('  channels     - Fetch and display all channels and categories');
		console.log('  members      - Fetch and display all members');
		console.log('  emojis       - Fetch and display all emojis and stickers');
		console.log('  permissions  - Analyze role permissions and hierarchy');
		console.log('  all          - Run all commands sequentially\n');
		console.log('Examples:');
		console.log('  node src/index.js roles YOUR_TOKEN YOUR_GUILD_ID');
		console.log('  node src/index.js all YOUR_TOKEN YOUR_GUILD_ID');
		console.log('  npm run roles YOUR_TOKEN YOUR_GUILD_ID\n');
		console.log('Note: You can also create a config.js file with botToken and guildId properties.');
		process.exit(0);
	}

	// Validate command
	if (command === 'all') {
		if (!botToken || !guildId) {
			console.error('❌ Error: Bot token and guild ID are required!');
			console.log('Usage: node src/index.js all <BOT_TOKEN> <GUILD_ID>');
			process.exit(1);
		}
		try {
			await runAll(botToken, guildId);
		} catch (error) {
			console.error('❌ Error:', error.message);
			process.exit(1);
		}
	} else if (commands[command]) {
		if (!botToken || !guildId) {
			console.error('❌ Error: Bot token and guild ID are required!');
			console.log(`Usage: node src/index.js ${command} <BOT_TOKEN> <GUILD_ID>`);
			process.exit(1);
		}
		try {
			await commands[command](botToken, guildId);
		} catch (error) {
			console.error('❌ Error:', error.message);
			process.exit(1);
		}
	} else {
		console.error(`❌ Error: Unknown command "${command}"`);
		console.log('Available commands: roles, channels, members, emojis, permissions, all');
		process.exit(1);
	}
}

// Run main function
main().catch((error) => {
	console.error('❌ Fatal error:', error.message);
	process.exit(1);
});
