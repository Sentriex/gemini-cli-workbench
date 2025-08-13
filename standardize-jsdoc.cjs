#!/usr/bin/env node

const fs = require('fs');

/**
 * The main function for the script.
 */
function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.error("Usage: standardize-jsdoc.js <file-path> <jsdoc-json-string>");
        process.exit(1);
    }

    const filePath = args[0];
    const jsdocDataString = args[1];

    let fileContent;
    try {
        fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file at ${filePath}: ${error.message}`);
        process.exit(1);
    }

    let jsdocData;
    try {
        jsdocData = JSON.parse(jsdocDataString);
    } catch (error) {
        console.error(`Error parsing JSDoc JSON: ${error.message}`);
        process.exit(1);
    }

    processJsdoc(filePath, fileContent, jsdocData);
}

/**
 * Finds and processes the JSDoc block in the file content.
 * @param {string} filePath - The path to the file being processed.
 * @param {string} fileContent - The original content of the file.
 * @param {object} jsdocData - The new JSDoc data.
 */
function processJsdoc(filePath, fileContent, jsdocData) {
    // Regex to find the first JSDoc block at the top of the file.
    const jsdocRegex = /^\s*\/\*\*[\s\S]*?\*\//;
    const existingBlockMatch = fileContent.match(jsdocRegex);

    const newBlockContent = buildNewJsdocBlock(jsdocData);
    let finalJsdocBlock;

    if (existingBlockMatch) {
        const existingBlock = existingBlockMatch[0];
        const preservedLines = existingBlock.split('\n').filter(line =>
            line.includes('Copyright') || line.includes('@license')
        );

        // Indent preserved lines correctly if they aren't already
        const indentedPreservedLines = preservedLines.map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('*')) {
                return ` ${trimmedLine}`;
            }
            return ` * ${trimmedLine}`;
        });

        const combinedLines = [...indentedPreservedLines, ...newBlockContent];
        finalJsdocBlock = `/**\n${combinedLines.join('\n')}\n */`;
    } else {
        finalJsdocBlock = `/**\n${newBlockContent.join('\n')}\n */`;
    }

    let updatedFileContent;
    if (existingBlockMatch) {
        updatedFileContent = fileContent.replace(jsdocRegex, finalJsdocBlock);
    } else {
        // Add a newline after the new block if the file isn't empty
        const separator = fileContent.length > 0 ? '\n\n' : '';
        updatedFileContent = `${finalJsdocBlock}${separator}${fileContent}`;
    }

    try {
        fs.writeFileSync(filePath, updatedFileContent, 'utf8');
        console.log(`Successfully updated JSDoc header in ${filePath}`);
    } catch (error) {
        console.error(`Error writing to file ${filePath}: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Builds the content of a JSDoc block from structured data.
 * @param {object} jsdocData - The new JSDoc data.
 * @returns {string[]} An array of formatted JSDoc lines.
 */
function buildNewJsdocBlock(jsdocData) {
    const lines = [];
    const tagOrder = [
        'file', 'version', 'description', 'summary', 'module',
        'dependencies', 'outputs', 'changelog'
    ];
    const tagsWithSpacing = ['module', 'dependencies', 'outputs', 'changelog'];

    tagOrder.forEach(tag => {
        if (jsdocData[tag]) {
            if (tagsWithSpacing.includes(tag) && lines.length > 0) {
                lines.push(' *');
            }
            if (Array.isArray(jsdocData[tag])) {
                lines.push(` * @${tag}`);
                jsdocData[tag].forEach(item => lines.push(` * - ${item}`));
            } else {
                const content = jsdocData[tag].replace(/\n/g, `\n * `);
                lines.push(` * @${tag} ${content}`);
            }
        }
    });

    return lines;
}

main();
