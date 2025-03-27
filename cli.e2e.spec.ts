import { describe, it, expect, beforeAll } from 'vitest';
import { execSync, spawnSync } from 'child_process';
import { rmSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT_DIR = resolve(__dirname);
const CLI_DIR = resolve(__dirname, './cli');
const SHARED_DIR = resolve(__dirname, './shared');
const TEMP_DIR = resolve(__dirname, './__cli-test');

const TGZ_NAME = 'esm_learning-cli-1.0.0.tgz';
const TGZ_PATH = join(TEMP_DIR, TGZ_NAME);

describe('CLI integration', () => {
    beforeAll(() => {
        // 🧹 Clean
        rmSync(TEMP_DIR, { recursive: true, force: true });
        rmSync(join(CLI_DIR, 'node_modules'), { recursive: true, force: true });
        rmSync(join(SHARED_DIR, 'node_modules'), { recursive: true, force: true });

        mkdirSync(TEMP_DIR, { recursive: true });

        // 🔨 Build all using root script
        execSync('npm install', { cwd: ROOT_DIR, stdio: 'inherit' });
        execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });

        // 📦 Pack CLI into test directory
        execSync(`npm pack --pack-destination ${TEMP_DIR}`, { cwd: CLI_DIR, stdio: 'inherit' });

        // 📂 Create temp consumer project and install .tgz
        execSync('npm init -y', { cwd: TEMP_DIR, stdio: 'inherit' });
        execSync(`npm install --no-workspaces ${TGZ_NAME}`, { cwd: TEMP_DIR, stdio: 'inherit' });
    });

    it('runs the packed CLI via bin script', () => {
        const result = spawnSync(join(TEMP_DIR, 'node_modules', '.bin', 'mycli'), [], {
            encoding: 'utf-8'
        });

        console.log('STDOUT:', result.stdout);
        console.log('STDERR:', result.stderr);
        console.log('EXIT CODE:', result.status);

        expect(result.status).toBe(0);
        expect(result.stdout.trim()).toBe('Hello, World!');
    });

});
