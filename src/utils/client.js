/**
 * Shared Discord client initialization utility
 * Uses discord.js v14 with GatewayIntentBits
 */

const { Client, GatewayIntentBits, Events } = require('discord.js');

/**
 * Creates and configures a Discord client with required intents
 * @returns {Client} Configured Discord client instance
 */
function createClient() {
	return new Client({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent],
	});
}

/**
 * Validates bot token and guild ID
 * @param {string} botToken - Discord bot token
 * @param {string} guildId - Discord guild ID
 * @throws {Error} If validation fails
 */
function validateInputs(botToken, guildId) {
	if (!botToken || botToken === '' || botToken === 'CHANGE' || botToken === 'YOUR_BOT_TOKEN_HERE') {
		throw new Error('Bot token is required!');
	}

	if (!guildId || guildId === '' || guildId === '000000000000000000' || guildId === 'YOUR_GUILD_ID_HERE') {
		throw new Error('Guild ID is required!');
	}
}

/**
 * Sets up client error handlers
 * @param {Client} client - Discord client instance
 */
function setupErrorHandlers(client) {
	client.on(Events.Error, (error) => {
		console.error('❌ Discord client error:', error.message);
	});

	client.on(Events.ShardError, (error) => {
		console.error('❌ Shard error:', error.message);
	});
}

/**
 * Connects the client to Discord
 * @param {Client} client - Discord client instance
 * @param {string} botToken - Discord bot token
 * @returns {Promise<void>}
 */
async function connectClient(client, botToken) {
	try {
		await client.login(botToken);
	} catch (error) {
		if (error.message.includes('TOKEN_INVALID')) {
			throw new Error('Invalid bot token. Please check your token and try again.');
		}
		throw error;
	}
}

/**
 * Fetches a guild by ID
 * @param {Client} client - Discord client instance
 * @param {string} guildId - Discord guild ID
 * @returns {Promise<Guild>}
 */
async function fetchGuild(client, guildId) {
	try {
		const guild = await client.guilds.fetch(guildId);
		if (!guild) {
			throw new Error(`Could not find guild with ID: ${guildId}`);
		}
		return guild;
	} catch (error) {
		if (error.code === 50001) {
			throw new Error("The bot doesn't have access to this guild.");
		} else if (error.code === 10004) {
			throw new Error('Guild not found. Check the guild ID.');
		} else if (error.code === 50013) {
			throw new Error("The bot doesn't have permission to view this guild.");
		}
		throw error;
	}
}

module.exports = {
	createClient,
	validateInputs,
	setupErrorHandlers,
	connectClient,
	fetchGuild,
};
