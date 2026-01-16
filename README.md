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

### Option 1: Install from GitHub Packages (Recommended)

```bash
# Configure npm to use GitHub Packages
echo "@anishbplayz:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc

# Install the package globally
npm install -g @anishbplayz/discord-guild-utils
```

**Note:** You need a GitHub Personal Access Token with `read:packages` permission. Create one at [GitHub Settings](https://github.com/settings/tokens).

After installation, you can use the `discord-guild-utils` command from anywhere:

```bash
discord-guild-utils roles
```

### Option 2: Install from source

1. Clone the repository:

```bash
git clone https://github.com/AnishBplayz/discord-guild-utils.git
cd discord-guild-utils
```

2. Install dependencies:

```bash
npm install
```

3. Use npm scripts:

```bash
npm run roles
```

## Configuration

You can provide your bot token and guild ID in several ways (in order of priority):

### 1. Command Line Arguments (Highest Priority)

```bash
discord-guild-utils roles YOUR_BOT_TOKEN YOUR_GUILD_ID
```

### 2. Environment Variables

```bash
export DISCORD_BOT_TOKEN="your_bot_token"
export DISCORD_GUILD_ID="your_guild_id"
discord-guild-utils roles
```

Or on Windows:

```cmd
set DISCORD_BOT_TOKEN=your_bot_token
set DISCORD_GUILD_ID=your_guild_id
discord-guild-utils roles
```

### 3. Local config.js File

Create a `config.js` file in your current directory:

```bash
cp config.js.example config.js
```

Then edit `config.js`:

```javascript
module.exports = {
	botToken: 'YOUR_BOT_TOKEN_HERE',
	guildId: 'YOUR_GUILD_ID_HERE',
};
```

### 4. Global Config File

Create a global configuration file that works from any directory:

**Linux/macOS:**

```bash
mkdir -p ~/.discord-guild-utils
cat > ~/.discord-guild-utils/config.js << EOF
module.exports = {
	botToken: 'YOUR_BOT_TOKEN_HERE',
	guildId: 'YOUR_GUILD_ID_HERE',
};
EOF
```

**Windows:**

```cmd
mkdir %USERPROFILE%\.discord-guild-utils
echo module.exports = { botToken: 'YOUR_BOT_TOKEN', guildId: 'YOUR_GUILD_ID' }; > %USERPROFILE%\.discord-guild-utils\config.js
```

**Note:** The `config.js` file is gitignored and will never be committed to your repository.

## Usage

### Command Line

If installed globally via npm:

```bash
# Fetch roles
discord-guild-utils roles [BOT_TOKEN] [GUILD_ID]

# Fetch channels
discord-guild-utils channels [BOT_TOKEN] [GUILD_ID]

# Fetch members
discord-guild-utils members [BOT_TOKEN] [GUILD_ID]

# Fetch emojis and stickers
discord-guild-utils emojis [BOT_TOKEN] [GUILD_ID]

# Analyze permissions
discord-guild-utils permissions [BOT_TOKEN] [GUILD_ID]

# Run all commands
discord-guild-utils all [BOT_TOKEN] [GUILD_ID]
```

If installed from source:

```bash
# Fetch roles
node src/index.js roles [BOT_TOKEN] [GUILD_ID]

# Or use npm scripts
npm run roles [BOT_TOKEN] [GUILD_ID]
```

**Note:** If you've configured bot token and guild ID via environment variables or config files, you can omit the arguments:

```bash
discord-guild-utils roles
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
discord-guild-utils roles YOUR_TOKEN YOUR_GUILD_ID
# or if configured via env/config:
discord-guild-utils roles
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
discord-guild-utils channels YOUR_TOKEN YOUR_GUILD_ID
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
discord-guild-utils members YOUR_TOKEN YOUR_GUILD_ID
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
discord-guild-utils emojis YOUR_TOKEN YOUR_GUILD_ID
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
discord-guild-utils permissions YOUR_TOKEN YOUR_GUILD_ID
```

## Output Formats

All commands provide output in multiple formats:

### Console Output

1. **Formatted Table**: Human-readable table format
2. **JavaScript Array**: Ready to paste into your code
3. **Comma-separated**: Simple list of IDs
4. **JavaScript Object**: Object with names as keys and IDs as values

### File Output

All commands automatically save their output to JSON files organized by guild ID in the `output/` directory:

- `output/[guildId]/roles.json` - Complete role data with metadata
- `output/[guildId]/channels.json` - Channel and category information
- `output/[guildId]/members.json` - Member data with roles and statistics
- `output/[guildId]/emojis.json` - Emoji and sticker data
- `output/[guildId]/permissions.json` - Permission analysis and role hierarchy

**Example structure:**

```
output/
├── 123456789012345678/
│   ├── roles.json
│   ├── channels.json
│   ├── members.json
│   ├── emojis.json
│   └── permissions.json
└── 987654321098765432/
    ├── roles.json
    └── channels.json
```

Each JSON file includes:

- Timestamp of when the data was fetched
- Guild information (ID and name)
- Complete structured data
- Statistics and analysis

The `output/` directory and guild subdirectories are automatically created if they don't exist. The entire `output/` directory is gitignored by default.

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
