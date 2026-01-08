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

    const jsonContent = JSON.stringify(commits, null, 2);
    fs.writeFileSync(outputPath, jsonContent);
    
    // Also write to public folder so it can be fetched at runtime
    const publicPath = path.join(__dirname, '../public/commits.json');
    fs.writeFileSync(publicPath, jsonContent);

    console.log(`Generated commits.json with ${commits.length} commits in src/ and public/.`);
} catch (error) {
    console.error('Error generating commits.json:', error);
    // Create an empty file or a placeholder if git fails (e.g., no repo)
    const emptyContent = JSON.stringify([], null, 2);
    fs.writeFileSync(outputPath, emptyContent);
    const publicPath = path.join(__dirname, '../public/commits.json');
    fs.writeFileSync(publicPath, emptyContent);
}
