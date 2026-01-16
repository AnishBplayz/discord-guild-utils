/**
 * Configuration loader utility
 * Supports multiple configuration sources in order of priority:
 * 1. Command line arguments
 * 2. Environment variables
 * 3. Local config.js file
 * 4. Global config file (~/.discord-guild-utils/config.js)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Loads configuration from multiple sources
 * @param {string} botToken - Bot token from command line (optional)
 * @param {string} guildId - Guild ID from command line (optional)
 * @returns {Object} Configuration object with botToken and guildId
 */
function loadConfig(botToken, guildId) {
	// Priority 1: Command line arguments (already provided)
	if (botToken && guildId) {
		return { botToken, guildId };
	}

	// Priority 2: Environment variables
	const envToken = process.env.DISCORD_BOT_TOKEN || process.env.BOT_TOKEN;
	const envGuildId = process.env.DISCORD_GUILD_ID || process.env.GUILD_ID;

	if (envToken && envGuildId) {
		return {
			botToken: envToken,
			guildId: envGuildId,
		};
	}

	// Priority 3: Local config.js (in project directory)
	try {
		const localConfigPath = path.join(process.cwd(), 'config.js');
		if (fs.existsSync(localConfigPath)) {
			const localConfig = require(localConfigPath);
			if (localConfig.botToken && localConfig.guildId) {
				return {
					botToken: botToken || localConfig.botToken,
					guildId: guildId || localConfig.guildId,
				};
			}
		}
	} catch (error) {
		// config.js doesn't exist or is invalid, continue to next option
	}

	// Priority 4: Global config file (~/.discord-guild-utils/config.js)
	try {
		const homeDir = os.homedir();
		const globalConfigPath = path.join(homeDir, '.discord-guild-utils', 'config.js');
		if (fs.existsSync(globalConfigPath)) {
			const globalConfig = require(globalConfigPath);
			if (globalConfig.botToken && globalConfig.guildId) {
				return {
					botToken: botToken || globalConfig.botToken,
					guildId: guildId || globalConfig.guildId,
				};
			}
		}
	} catch (error) {
		// Global config doesn't exist or is invalid
	}

	// Return whatever we have (may be partial)
	return {
		botToken: botToken || envToken || null,
		guildId: guildId || envGuildId || null,
	};
}

/**
 * Gets instructions for setting up configuration
 * @returns {string} Instructions text
 */
function getConfigInstructions() {
	return `
📝 Configuration Options:

You can provide bot token and guild ID in several ways (in order of priority):

1. Command line arguments:
   discord-guild-utils roles <BOT_TOKEN> <GUILD_ID>

2. Environment variables:
   export DISCORD_BOT_TOKEN="your_token"
   export DISCORD_GUILD_ID="your_guild_id"
   discord-guild-utils roles

3. Local config.js file (in current directory):
   Create config.js:
   module.exports = {
     botToken: 'your_token',
     guildId: 'your_guild_id'
   };

4. Global config file (~/.discord-guild-utils/config.js):
   mkdir -p ~/.discord-guild-utils
   Create ~/.discord-guild-utils/config.js with the same format as above.

Note: You can copy config.js.example to config.js as a template.
`;
}

module.exports = {
	loadConfig,
	getConfigInstructions,
};
