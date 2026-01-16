# discord-guild-utils

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.12.0-brightgreen.svg)](https://nodejs.org/)
[![discord.js](https://img.shields.io/badge/discord.js-v14.25.1%2B-blue.svg)](https://discord.js.org/)

A comprehensive Discord utility suite for fetching and analyzing guild data including roles, channels, members, emojis, stickers, and permissions.

## Features

- **Roles**: Fetch and display all roles with IDs, positions, and colors
- **Channels**: Fetch all channels and categories with hierarchy and metadata
- **Members**: Fetch all members with roles, join dates, and statistics
- **Emojis & Stickers**: Fetch all emojis and stickers with metadata
- **Permissions**: Analyze role permissions, hierarchy, and potential conflicts

## Requirements

- Node.js 22.12.0 or newer
- A Discord bot token
- Bot must be in the target guild/server
- Required bot intents:
    - Guilds
    - Guild Members
    - Guild Messages
    - Guild Presences
    - Message Content

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd discord-guild-utils
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a `config.js` file from the template:

```bash
cp config.js.example config.js
```

Then edit `config.js` and add your bot token and guild ID:

```javascript
module.exports = {
	botToken: 'YOUR_BOT_TOKEN_HERE',
	guildId: 'YOUR_GUILD_ID_HERE',
};
```

## Usage

### Command Line

You can run commands directly with Node.js:

```bash
# Fetch roles
node src/index.js roles <BOT_TOKEN> <GUILD_ID>

# Fetch channels
node src/index.js channels <BOT_TOKEN> <GUILD_ID>

# Fetch members
node src/index.js members <BOT_TOKEN> <GUILD_ID>

# Fetch emojis and stickers
node src/index.js emojis <BOT_TOKEN> <GUILD_ID>

# Analyze permissions
node src/index.js permissions <BOT_TOKEN> <GUILD_ID>

# Run all commands
node src/index.js all <BOT_TOKEN> <GUILD_ID>
```

### NPM Scripts

If you have a `config.js` file, you can use npm scripts:

```bash
npm run roles
npm run channels
npm run members
npm run emojis
npm run permissions
npm run all
```

### Using config.js

If you've created a `config.js` file, you can omit the token and guild ID:

```bash
node src/index.js roles
```

## Commands

### Roles

Fetches and displays all roles from a guild.

**Output includes:**

- Formatted table with role names, IDs, positions, and colors
- JavaScript array format
- Comma-separated IDs
- Object format with role names as keys
- Special roles highlight (@everyone, bot role, managed roles)

**Example:**

```bash
node src/index.js roles YOUR_TOKEN YOUR_GUILD_ID
```

### Channels

Fetches and displays all channels and categories from a guild.

**Output includes:**

- Categories list
- Channels grouped by category
- Channel types (Text, Voice, Stage, Forum, etc.)
- JavaScript array format
- Comma-separated IDs
- Object format with channel names as keys
- Channel statistics

**Example:**

```bash
node src/index.js channels YOUR_TOKEN YOUR_GUILD_ID
```

### Members

Fetches and displays all members from a guild.

**Output includes:**

- Member list with usernames, IDs, display names, role counts, and join dates
- JavaScript array format
- Comma-separated IDs
- Object format with usernames as keys
- Member statistics (total, humans, bots, role distribution)

**Note:** For large servers, fetching all members may take some time.

**Example:**

```bash
node src/index.js members YOUR_TOKEN YOUR_GUILD_ID
```

### Emojis

Fetches and displays all emojis and stickers from a guild.

**Output includes:**

- Emoji list with names, IDs, animation status, availability, and managed status
- Sticker list with names, IDs, types, availability, and descriptions
- JavaScript array format for both
- Comma-separated IDs
- Object format with names as keys
- Discord emoji format (for use in messages)
- Statistics for emojis and stickers

**Example:**

```bash
node src/index.js emojis YOUR_TOKEN YOUR_GUILD_ID
```

### Permissions

Analyzes role permissions and hierarchy.

**Output includes:**

- Role hierarchy sorted by position
- Permission count for each role
- Administrator status
- Permission analysis (roles with specific permissions)
- Potential permission conflicts
- Detailed permission breakdown for each role

**Example:**

```bash
node src/index.js permissions YOUR_TOKEN YOUR_GUILD_ID
```

## Output Formats

All commands provide output in multiple formats for easy copying:

1. **Formatted Table**: Human-readable table format
2. **JavaScript Array**: Ready to paste into your code
3. **Comma-separated**: Simple list of IDs
4. **JavaScript Object**: Object with names as keys and IDs as values

## Configuration

### Bot Token

Get your bot token from the [Discord Developer Portal](https://discord.com/developers/applications):

1. Go to your application
2. Navigate to "Bot" section
3. Click "Reset Token" or copy existing token
4. Keep this token secret!

### Guild ID

To get your guild (server) ID:

1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click on your server icon
3. Click "Copy Server ID"

### Required Intents

Make sure your bot has the following intents enabled in the Discord Developer Portal:

- Server Members Intent
- Message Content Intent
- Presence Intent (optional but recommended)

## Project Structure

```
discord-guild-utils/
├── src/
│   ├── index.js              # Main CLI entry point
│   ├── utils/
│   │   ├── client.js         # Shared Discord client setup
│   │   └── formatters.js     # Output formatting utilities
│   └── commands/
│       ├── roles.js          # Fetch roles
│       ├── channels.js       # Fetch channels
│       ├── members.js        # Fetch members
│       ├── emojis.js         # Fetch emojis and stickers
│       └── permissions.js   # Analyze permissions
├── package.json
├── config.js.example         # Configuration template
└── README.md
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### "Bot token is required!"

- Make sure you've provided the bot token either via command line or in `config.js`
- Check that `config.js` exists and has valid `botToken` and `guildId` properties

### "Guild not found"

- Verify the guild ID is correct
- Make sure the bot is in the target server
- Check that the bot has access to the guild

### "The bot doesn't have permission to view..."

- Ensure the bot has the necessary permissions in the server
- Check that required intents are enabled in the Discord Developer Portal

### "Invalid bot token"

- Verify your bot token is correct
- Make sure you haven't accidentally exposed or reset your token
- Check that the bot application is still active

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- Built with [discord.js](https://discord.js.org/) v14.25.1+
