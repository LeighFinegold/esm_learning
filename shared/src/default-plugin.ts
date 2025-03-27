import { Plugin } from './plugin.js';

export default class DefaultPlugin implements Plugin {
    action() {
        console.log('👋 Hello from the default plugin!');
    }
}
