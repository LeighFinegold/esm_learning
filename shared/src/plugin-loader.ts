import { Plugin } from './plugin.js';
import { pathToFileURL } from 'url';

export class PluginLoader {
    static async loadAndRun(filePath: string) {
        let PluginClass;

        try {
            // Try dynamic import first (works for ESM + CJS interop)
            const mod = await import(pathToFileURL(filePath).href);
            PluginClass = mod.default;
        } catch (e: any) {
            throw new Error(`❌ Failed to load plugin from ${filePath}: ${e.message}`);
        }

        if (!PluginClass) throw new Error(`No default export found in ${filePath}`);

        const instance: Plugin = new PluginClass();
        if (typeof instance.action !== 'function') {
            throw new Error(`Plugin does not implement action()`);
        }

        await instance.action();
    }
}
