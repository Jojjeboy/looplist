import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '../src/commits.json');

try {
    const logOutput = execSync('git log --pretty=format:"%H|%an|%ad|%s" --date=iso', { encoding: 'utf-8' });

    const commits = logOutput.split('\n').map(line => {
        const [hash, author, date, message] = line.split('|');
        return { hash, author, date, message };
    }).filter(commit => commit.hash); // Filter out empty lines

    fs.writeFileSync(outputPath, JSON.stringify(commits, null, 2));
    console.log(`Generated src/commits.json with ${commits.length} commits.`);
} catch (error) {
    console.error('Error generating commits.json:', error);
    // Create an empty file or a placeholder if git fails (e.g., no repo)
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
}
