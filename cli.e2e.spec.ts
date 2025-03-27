import { describe, it, expect, beforeAll } from 'vitest';
import { execSync, spawnSync } from 'child_process';
import { rmSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const ROOT_DIR = resolve(__dirname);
const CLI_DIR = resolve(__dirname, './cli');
const SHARED_DIR = resolve(__dirname, './shared');
const TEMP_DIR = resolve(__dirname, './__cli-test');
const CLI_TGZ = 'esm_learning-cli-1.0.0.tgz';
const SHARED_TGZ = 'esm_learning-shared-1.0.0.tgz';
const CLI_USER_DIR = join(TEMP_DIR, 'cli-user');
const LIB_USER_DIR = join(TEMP_DIR, 'lib-user');

describe('Integration: shared as local tgz + CLI as tgz', () => {
    beforeAll(() => {
        // 🧹 Clean everything
        rmSync(TEMP_DIR, { recursive: true, force: true });
        mkdirSync(TEMP_DIR);
        mkdirSync(CLI_USER_DIR);
        mkdirSync(LIB_USER_DIR);

        // 🔧 Prepare CLI for packaging
        execSync('npm run prepare-publish', { cwd: CLI_DIR, stdio: 'inherit' });

        // 🔨 Install + build everything
        execSync('npm install', { cwd: ROOT_DIR, stdio: 'inherit' });
        execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });

        // 📦 Pack shared + cli into test dir
        execSync(`npm pack --pack-destination ${TEMP_DIR}`, {
            cwd: SHARED_DIR,
            stdio: 'inherit'
        });
        execSync(`npm pack --pack-destination ${TEMP_DIR}`, {
            cwd: CLI_DIR,
            stdio: 'inherit'
        });

        // 📂 Init both consumers
        execSync('npm init -y', { cwd: CLI_USER_DIR, stdio: 'inherit' });
        execSync('npm init -y', { cwd: LIB_USER_DIR, stdio: 'inherit' });

        // 📦 Install CLI + shared .tgz into cli-user
        execSync(`npm install --no-workspaces ../${SHARED_TGZ}`, {
            cwd: CLI_USER_DIR,
            stdio: 'inherit'
        });
        execSync(`npm install --no-workspaces ../${CLI_TGZ}`, {
            cwd: CLI_USER_DIR,
            stdio: 'inherit'
        });

        // 📦 Install shared .tgz into lib-user
        execSync(`npm install --no-workspaces ../${SHARED_TGZ}`, {
            cwd: LIB_USER_DIR,
            stdio: 'inherit'
        });
    });

    it('runs the packed CLI binary successfully', () => {
        const result = spawnSync(join(CLI_USER_DIR, 'node_modules', '.bin', 'mycli'), [], {
            encoding: 'utf-8'
        });

        console.log('CLI STDOUT:', result.stdout);
        console.log('CLI STDERR:', result.stderr);

        expect(result.status).toBe(0);
        expect(result.stdout.trim()).toBe('Hello, World!');
    });

    it('imports and runs shared library from .tgz', () => {
        const consumerFile = join(LIB_USER_DIR, 'consumer.mjs');

        writeFileSync(
            consumerFile,
            `
        import { greet } from '@esm_learning/shared';
        console.log(greet("Library User"));
      `,
            'utf-8'
        );

        const result = spawnSync('node', [consumerFile], { encoding: 'utf-8' });

        console.log('LIB STDOUT:', result.stdout);
        console.log('LIB STDERR:', result.stderr);

        expect(result.status).toBe(0);
        expect(result.stdout.trim()).toBe('Hello, Library User!');
    });
});
