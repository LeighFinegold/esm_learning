import { PluginLoader } from './plugin-loader.js';
import path from 'path';
import { getDirname } from './dirname.js';
const __dirname = getDirname(typeof import.meta !== 'undefined' ? import.meta.url : undefined);
const pluginPath = path.resolve(__dirname, './default-plugin.js');

export async function runDefaultPlugin() {
    await PluginLoader.loadAndRun(pluginPath);
}