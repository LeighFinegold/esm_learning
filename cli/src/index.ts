import { greet, runDefaultPlugin } from '@esm_learning/shared';

async function main() {
    console.log(greet("World"));
    await runDefaultPlugin();
}

main();
