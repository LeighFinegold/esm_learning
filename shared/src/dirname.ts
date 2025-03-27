import path from 'path';
import { fileURLToPath } from 'url';

export function getDirname(metaUrl?: string): string {
    if (metaUrl) {
        return path.dirname(fileURLToPath(metaUrl));
    }

    // fallback for CJS
    return __dirname;
}
