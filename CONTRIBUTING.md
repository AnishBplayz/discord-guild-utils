# Contributing to discord-guild-utils

Thank you for your interest in contributing to discord-guild-utils! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (Node.js version, OS, etc.)
- Any relevant error messages or logs

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:

- A clear description of the feature
- Use case and motivation
- Potential implementation approach (if you have ideas)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**:

    ```bash
    git checkout -b feature/your-feature-name
    ```

3. **Make your changes**:
    - Follow the existing code style
    - Add comments for complex logic
    - Update documentation if needed
    - Test your changes thoroughly

4. **Commit your changes**:

    ```bash
    git commit -m "Add: description of your changes"
    ```

    Use clear, descriptive commit messages.

5. **Push to your fork**:

    ```bash
    git push origin feature/your-feature-name
    ```

6. **Open a Pull Request**:
    - Provide a clear description of your changes
    - Reference any related issues
    - Ensure all checks pass

## Development Setup

1. Clone your fork:

    ```bash
    git clone https://github.com/your-username/discord-guild-utils.git
    cd discord-guild-utils
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `config.js` file for testing:

    ```bash
    cp config.js.example config.js
    ```

    Then add your test bot token and guild ID.

4. Test your changes:
    ```bash
    node src/index.js roles
    ```

## Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (unless escaping)
- Use `const` and `let` (avoid `var`)
- Use arrow functions where appropriate
- Add JSDoc comments for functions
- Keep functions focused and modular
- Use descriptive variable and function names

## Project Structure

- `src/utils/` - Shared utilities (client setup, formatters)
- `src/commands/` - Individual command modules
- `src/index.js` - Main CLI entry point

## Testing

Before submitting a PR:

- Test all affected commands
- Verify error handling works correctly
- Check that output formats are correct
- Ensure no console errors or warnings

## Documentation

- Update README.md if you add new features
- Add JSDoc comments for new functions
- Update examples if behavior changes

## Questions?

If you have questions, feel free to:

- Open an issue with the "question" label
- Check existing issues and discussions

Thank you for contributing! 🎉
