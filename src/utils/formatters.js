/**
 * Output formatting utilities for consistent display across all commands
 */

/**
 * Creates a formatted table header
 * @param {Array<string>} columns - Array of column names
 * @param {Array<number>} widths - Array of column widths
 * @returns {string} Formatted header line
 */
function createTableHeader(columns, widths) {
	let header = '';
	columns.forEach((col, index) => {
		header += col.padEnd(widths[index] || 20);
		if (index < columns.length - 1) {
			header += ' | ';
		}
	});
	return header;
}

/**
 * Creates a separator line for tables
 * @param {number} length - Length of the separator
 * @param {string} char - Character to use for separator
 * @returns {string} Separator line
 */
function createSeparator(length = 80, char = '=') {
	return char.repeat(length);
}

/**
 * Formats an array of items as a JavaScript array
 * @param {Array} items - Array of items to format
 * @param {Function} getId - Function to extract ID from item
 * @param {Function} getName - Function to extract name from item (optional)
 * @returns {string} Formatted JavaScript array string
 */
function formatAsArray(items, getId, getName) {
	let output = 'const items = [\n';
	items.forEach((item, index) => {
		const comma = index < items.length - 1 ? ',' : '';
		const id = getId(item);
		const name = getName ? getName(item) : '';
		const comment = name ? ` // ${name}` : '';
		output += `    "${id}"${comma}${comment}\n`;
	});
	output += '];\n';
	return output;
}

/**
 * Formats an array of items as a comma-separated string
 * @param {Array} items - Array of items to format
 * @param {Function} getId - Function to extract ID from item
 * @returns {string} Comma-separated IDs
 */
function formatAsCommaSeparated(items, getId) {
	return items.map((item) => getId(item)).join(', ');
}

/**
 * Formats an array of items as a JavaScript object
 * @param {Array} items - Array of items to format
 * @param {Function} getId - Function to extract ID from item
 * @param {Function} getName - Function to extract name from item
 * @returns {string} Formatted JavaScript object string
 */
function formatAsObject(items, getId, getName) {
	let output = 'const items = {\n';
	items.forEach((item, index) => {
		const comma = index < items.length - 1 ? ',' : '';
		const id = getId(item);
		const name = getName(item);
		const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
		output += `    ${safeName}: "${id}"${comma} // ${name}\n`;
	});
	output += '};\n';
	return output;
}

/**
 * Formats a table row
 * @param {Array} values - Array of values for each column
 * @param {Array<number>} widths - Array of column widths
 * @returns {string} Formatted table row
 */
function formatTableRow(values, widths) {
	let row = '';
	values.forEach((value, index) => {
		row += String(value).padEnd(widths[index] || 20);
		if (index < values.length - 1) {
			row += ' | ';
		}
	});
	return row;
}

/**
 * Sanitizes a string for use as a JavaScript identifier
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeIdentifier(str) {
	return str.replace(/[^a-zA-Z0-9_]/g, '_');
}

module.exports = {
	createTableHeader,
	createSeparator,
	formatAsArray,
	formatAsCommaSeparated,
	formatAsObject,
	formatTableRow,
	sanitizeIdentifier,
};
