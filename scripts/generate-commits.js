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
        if (!hash) return null;
        
        // Get the files changed in this commit
        try {
            const filesOutput = execSync(`git show --name-status --pretty="" ${hash}`, { encoding: 'utf-8' });
            const files = filesOutput.trim().split('\n')
                .filter(line => line.trim())
                .map(line => {
                    const parts = line.trim().split(/\s+/);
                    return {
                        status: parts[0], // M (modified), A (added), D (deleted), etc.
                        path: parts.slice(1).join(' ')
                    };
                });
            
            return { hash, author, date, message, files };
        } catch (error) {
            // If we can't get files for some reason, just return without them
            return { hash, author, date, message, files: [] };
        }
    }).filter(commit => commit !== null);

    fs.writeFileSync(outputPath, JSON.stringify(commits, null, 2));
    console.log(`Generated src/commits.json with ${commits.length} commits.`);
} catch (error) {
    console.error('Error generating commits.json:', error);
    // Create an empty file or a placeholder if git fails (e.g., no repo)
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
}
