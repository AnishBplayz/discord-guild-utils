/**
 * Utility for writing command output to files
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(process.cwd(), 'output');

/**
 * Ensures the output directory exists
 * @param {string} guildId - Optional guild ID to create subdirectory
 */
function ensureOutputDir(guildId) {
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	if (guildId) {
		const guildDir = path.join(OUTPUT_DIR, guildId);
		if (!fs.existsSync(guildDir)) {
			fs.mkdirSync(guildDir, { recursive: true });
		}
	}
}

/**
 * Writes data to a JSON file in the output directory
 * @param {string} filename - Name of the file (without extension)
 * @param {Object} data - Data to write
 * @param {string} guildId - Optional guild ID to organize files in subdirectory
 * @returns {string} Path to the written file
 */
function writeJSON(filename, data, guildId) {
	ensureOutputDir(guildId);

	const targetDir = guildId ? path.join(OUTPUT_DIR, guildId) : OUTPUT_DIR;
	const filepath = path.join(targetDir, `${filename}.json`);
	const jsonData = {
		timestamp: new Date().toISOString(),
		...data,
	};

	fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2), 'utf8');
	return filepath;
}

/**
 * Writes text to a file in the output directory
 * @param {string} filename - Name of the file (with extension)
 * @param {string} content - Content to write
 * @param {string} guildId - Optional guild ID to organize files in subdirectory
 * @returns {string} Path to the written file
 */
function writeText(filename, content, guildId) {
	ensureOutputDir(guildId);

	const targetDir = guildId ? path.join(OUTPUT_DIR, guildId) : OUTPUT_DIR;
	const filepath = path.join(targetDir, filename);
	fs.writeFileSync(filepath, content, 'utf8');
	return filepath;
}

module.exports = {
	writeJSON,
	writeText,
	OUTPUT_DIR,
};
