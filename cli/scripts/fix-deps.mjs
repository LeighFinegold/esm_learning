import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve file paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPkgPath = path.resolve(__dirname, '../package.json');
const sharedPkgPath = path.resolve(__dirname, '../../shared/package.json');

// Read both package.json files
const cliPkg = JSON.parse(fs.readFileSync(cliPkgPath, 'utf-8'));
const sharedPkg = JSON.parse(fs.readFileSync(sharedPkgPath, 'utf-8'));

// Check if dependency is a file: reference
if (cliPkg.dependencies?.['@esm_learning/shared']?.startsWith('file:')) {
    const sharedVersion = `^${sharedPkg.version}`;
    cliPkg.dependencies['@esm_learning/shared'] = sharedVersion;
    fs.writeFileSync(cliPkgPath, JSON.stringify(cliPkg, null, 2) + '\n');
    console.log(`🔁 Updated @esm_learning/shared to ${sharedVersion} in CLI dependencies`);
} else {
    console.log('✅ Dependency is already a version, no change made.');
}
